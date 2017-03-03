require('dotenv').config();
var url = require('url');
var express = require('express');
var flash = require('express-flash');
var app = express();
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport'),
    TwitterStrategy = require('passport-twitter').Strategy;
var addpoll = require('./modules/addpolltodb');
var selectpolls = require('./modules/selectpolls');
var pollvote = require('./modules/pollvote');
var deletepoll = require('./modules/deletepoll');

//app settings for login and session settings
app.set('port', (process.env.PORT));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: process.env.APP_SECRET, resave: true, saveUninitialized: true, cookie: { maxAge: 60000 }}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new TwitterStrategy({
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
    callbackURL: process.env.APP_URL
  },
   function(token, tokenSecret, profile, cb) {
     return cb(null, profile);
  }
));
passport.serializeUser(function(user, cb) {
  cb(null, user);
});
passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

//pug files localization
app.set('views', __dirname +'/views');
app.set('view engine', 'pug');
app.use(flash());
//routing
app.use('/',express.static(__dirname+'/public'));
app.use('/scripts', express.static(__dirname+'/node_modules/chart.js/dist/'));
//home page
app.get('/',
  function(req, res) {
    selectpolls(process.env.MONGOLAB_URI,'polls',null,null,
    function(docs){
      res.render('home', { user: req.user, polls: docs });
    });
});

//twiiter sign in
app.get('/auth/twitter', passport.authenticate('twitter'));
app.get('/auth/twitter/callback', 
  passport.authenticate('twitter', { failureRedirect: '/' }),
  function(req, res) {
      res.redirect('/');
  });
//session destroy
app.get('/logout', function(req, res){
  req.session.destroy(function (err) {
    if(err) throw err;
    res.redirect('/');
  });
});

//adding new polls
app.get('/newpoll', 
  require('connect-ensure-login').ensureLoggedIn('/'),
  function(req,res){
   res.render('newpoll',{user: req.user});
});

app.post('/createpoll',function(req,res){
  addpoll(process.env.MONGOLAB_URI,'polls',req.body,req.user.username,res.redirect('/mypolls'));
});

//user polls
app.get('/mypolls', 
  require('connect-ensure-login').ensureLoggedIn('/'),
  function(req,res){
  selectpolls(process.env.MONGOLAB_URI,'polls',req.user.username,null,
  function(docs){
    res.render('mypolls',{user: req.user, polls: docs}); 
  }
  );
   
});

//view single poll - chart and voting form
app.get('/polldetails',
  function(req,res){
    var newurl = url.parse(req.url,true);
    var reqip = req.headers['x-forwarded-for'] || req.connection.remoteAddress ||  req.socket.remoteAddress ||  req.connection.socket.remoteAddress;
    var fullurl = req.get('host') + req.originalUrl;
    selectpolls(process.env.MONGOLAB_URI,'polls',null,newurl.query.pollid,function(docs){
      res.render('polldetails',{user: req.user, polls: docs, ip: reqip, fulldir: fullurl});
    });
  }
);


//voting

app.post('/pollvote',
  function(req,res){
    pollvote(process.env.MONGOLAB_URI,'polls',req.body.pollid,req.body.votername,req.body.voterip,req.body.votefor,req.body.customoption,function(status){
      if(status==0){
        req.flash('info', 'You can only vote once a poll [user or ip].');
        res.redirect('/polldetails?pollid='+req.body.pollid);
      }
      if(status==1){
        req.flash('info', 'Thank you for voting!');
        res.redirect('/polldetails?pollid='+req.body.pollid);
      }
      
    });  
    
  }
);

//delete poll
app.get('/deletepoll',
  function(req,res){
    var newurl = url.parse(req.url,true);
    var pollid = newurl.query.pollid;
    deletepoll(process.env.MONGOLAB_URI,'polls',pollid,function(result){
      req.flash('info', 'Poll successfully removed');
      res.redirect('/');
    });
  }
);






app.listen(app.get('port'));

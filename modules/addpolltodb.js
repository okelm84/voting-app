module.exports = function(dbURL,collectionName,pollbody,author,callback){
    var mongodb = require('mongodb');
    var MongoClient = mongodb.MongoClient;
    var pollopt=pollbody.polloptions.split(';');
    var pollres =[];
    var myobj = {};
    var d = new Date();
    
    myobj.author = author;
    myobj.title = pollbody.pollname;
    myobj.date = d.toUTCString();
    for(var i=0;i<pollopt.length;i++){
        pollres.push(0);    
    }
    myobj.options = pollopt;
    myobj.results = pollres;
    myobj.whovoted = [];
    MongoClient.connect(dbURL, function(err,db){
       if(err) throw err;
       db.collection(collectionName).insert(myobj,function(err,data){if(err){throw err;} db.close(); callback});
    });
    
};
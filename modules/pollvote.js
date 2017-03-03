module.exports = function(dbURL,collectionName,pollid,votername,voterip,votetopt,votetcustopt,callback){
    var mongodb = require('mongodb');
    var MongoClient = mongodb.MongoClient;
    var ObjectId = require('mongodb').ObjectID;
    var votedbefore = false;
    var votedip = -1;
    var votedusr = -1;
    var status = -1;
    MongoClient.connect(dbURL, function(err,db){
        if(err) throw err;
        db.collection(collectionName).find(ObjectId(pollid)).toArray(function(err,docs){
            if(err) throw err;
            var temparr=docs[0].whovoted;
            votedip=temparr.indexOf(voterip+'');
            votedusr=temparr.indexOf(votername+'');
            if(votedip>=0 || votedusr>=0){
               callback(0); 
            }
            else{
                var newwhovoted = [];
                var newresults = [];
                var newoptions = [];
                for(var i=0;i<docs[0].whovoted.length;i++){
                    newwhovoted.push(docs[0].whovoted[i]);
                }
                for(var i=0;i<docs[0].options.length;i++){
                    newresults.push(docs[0].results[i]);
                    newoptions.push(docs[0].options[i]);
                }
                
                newwhovoted.push(voterip);
                if(votername!=''){newwhovoted.push(votername);}
                
                if(Number(votetopt)>=0){
                    newresults[Number(votetopt)]++;
                }else{
                    if(votetcustopt!=''){
                        newresults.push(1);
                        newoptions.push(votetcustopt);
                        
                    }
                }
                db.collection(collectionName).updateOne({'_id': ObjectId(pollid)}, {$set: {"options" : newoptions, "results" : newresults, "whovoted": newwhovoted}},function(err,updated){
                    if(err) throw err;
                    db.close();
                    callback(1);
                });
            }
            });
        
    });               
};
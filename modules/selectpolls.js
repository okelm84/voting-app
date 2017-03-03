module.exports = function(dbURL,collectionName,author,pollid,callback){
    var mongodb = require('mongodb');
    var MongoClient = mongodb.MongoClient;
    var ObjectId = require('mongodb').ObjectID;
    if(author!=null){
        MongoClient.connect(dbURL, function(err,db){
            if(err) throw err;
            db.collection(collectionName).find({author : author}).sort({when:-1}).toArray(function(err,docs){if(err) throw err;
               db.close();
               callback(docs); 
            });
        });
    }
    else{
        if(pollid!=null){
        MongoClient.connect(dbURL, function(err,db){
            if(err) throw err;
            db.collection(collectionName).find(ObjectId(pollid)).toArray(function(err,docs){if(err) throw err;
               db.close();
               callback(docs); 
            });
        });
        }
        else{
           MongoClient.connect(dbURL, function(err,db){
            if(err) throw err;
            db.collection(collectionName).find().sort({when:-1}).toArray(function(err,docs){if(err) throw err;
               db.close();
               callback(docs); 
            });
        }); 
        }
    }
};
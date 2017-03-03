module.exports = function(dbURL,collectionName,pollid,callback){
    var mongodb = require('mongodb');
    var MongoClient = mongodb.MongoClient;
    var ObjectId = require('mongodb').ObjectID;
    MongoClient.connect(dbURL, function(err,db){
        if(err) throw err;
        db.collection(collectionName).remove({'_id': ObjectId(pollid)}, function(err,result){if(err) throw err; db.close(); callback(result)});
        
    });
    
}
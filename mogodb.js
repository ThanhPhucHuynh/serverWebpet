

const MogoClient = require('mongodb').MongoClient;
const assert = require('assert');

const url = 'mongodb://localhost:27017'//'/?serverSelectionTimeoutMS=5000&connectTimeoutMS=10000&3t.uriVersion=3&3t.connection.name=http%3A%2F%2Flocalhost%2F'
const dbName = 'bookDB'

MogoClient.connect(url,(err,client)=>{
    assert.equal(null,err)
    console.log('Connected......')
    const db = client.db(dbName)
    console.log(db.collection('books'));
   // insertDocuments(db, function() {
        findDocuments(db, function() {
          client.close();
        });
     // });
})
const findDocument = (db, callback)=>{
    const collection = db.collection('books');
    collection.find({}).toArray((err,docs)=>{
        assert(err, null)
        console.log('Found the,.....')
        console.log(docs)
        callback(docs);
    })
}
const findDocuments = function(db, callback) {
    // Get the documents collection
    const collection = db.collection('user');
    // Find some documents
    collection.find({}).toArray(function(err, docs) {
      assert.equal(err, null);
      console.log("Found the following records");
      console.log(docs)
      callback(docs);
    });
  }
const insertDocuments = function(db, callback) {
    // Get the documents collection
    const collection = db.collection('documents');
    // Insert some documents
    collection.insertMany([
      {a : 1}, {a : 2}, {a : 3}
    ], function(err, result) {
      assert.equal(err, null);
      assert.equal(3, result.result.n);
      assert.equal(3, result.ops.length);
      console.log("Inserted 3 documents into the collection");
      callback(result);
    });
  }
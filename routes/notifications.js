var express = require('express');
var router = express.Router();

const MongoClient = require('mongodb').MongoClient;
ObjectID = require('mongodb').ObjectID
const assert = require('assert');

// const url = 'mongodb://localhost:27017'
const url = 'mongodb+srv://ericvu:dhdkmvl5@eric-dev-cluster-zlepn.mongodb.net/fridgedb?retryWrites=true'
const dbName = 'fridgedb'


const insertToken = (db, id, token, callback) => {
  let categoryresults = db.collection('users').updateOne({_id: ObjectID(id)}, {$set: {device_token: token}}, (err, res) => {
    assert.equal(null, err);
    console.log(res);
    callback(res)
  });
}


/* GET users listing. */

router.post('/token', function(req, res, next) {
  const id = req.body.id
  const token = req.body.token

  MongoClient.connect(url, (err, client) => {
    assert.equal(null, err);
    console.log("Connected successfully to server");

    const db = client.db(dbName);
    let r = insertToken(db, id, token, (results) => {
      client.close();
      console.log(results);
      res.send(results);
    })
  });
});

module.exports = router;

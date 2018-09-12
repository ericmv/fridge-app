var express = require('express');
var router = express.Router();

const MongoClient = require('mongodb').MongoClient;
ObjectID = require('mongodb').ObjectID
const assert = require('assert');

const url = 'mongodb://localhost:27017'

const dbName = 'fridgedb'


const browseCategory = (db, user, category, callback) => {
  const user_id = ObjectID(user);
  let user_cursor = db.collection('users').findOne({_id: ObjectID(user)})
  .then(res => {
    const fridge_id = res.fridge;
    let categoryresults = db.collection('fridges').aggregate([{$match: {_id:fridge_id}},
    {$project: {contents:{$filter:{input: '$contents', as:'contents',
    cond:{$eq: ['$$contents.category',category]}}},_id:0}}]).toArray((err, results) => {
      assert.equal(null, err);
      callback(results);
    });
  })
}

const browseUser = (db, user, callback) => {
  const user_id = ObjectID(user);
  let user_cursor = db.collection('users').findOne({_id: ObjectID(user)})
  .then(res => {
    const fridge_id = res.fridge;
    let categoryresults = db.collection('fridges').aggregate([{$match: {_id:fridge_id}},
    {$project: {contents:{$filter:{input: '$contents', as:'contents',
    cond:{$eq: ['$$contents.owner_id',user_id]}}},_id:0}}]).toArray((err, results) => {
      assert.equal(null, err);
      callback(results);
    });
  })
}

/* GET users listing. */
router.post('/category', function(req, res, next) {
  const category = req.body.category;
  const user = req.body.user;
  MongoClient.connect(url, (err, client) => {
    assert.equal(null, err);
    console.log("Connected successfully to server");

    const db = client.db(dbName);
    let r = browseCategory(db, user, category, (results) => {
      client.close();
      console.log(results);
      res.send(results[0]['contents']);
    })
  });


});

router.post('/user', function(req, res, next) {
  const user = req.body.user;
  MongoClient.connect(url, (err, client) => {
    assert.equal(null, err);
    console.log("Connected successfully to server");

    const db = client.db(dbName);
    let r = browseUser(db, user, (results) => {
      client.close();
      console.log(results);
      res.send(results[0]['fridge_contents']);
    })
  });


});

module.exports = router;

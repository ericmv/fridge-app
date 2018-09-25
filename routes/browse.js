var express = require('express');
var router = express.Router();

const MongoClient = require('mongodb').MongoClient;
ObjectID = require('mongodb').ObjectID
const assert = require('assert');

// const url = 'mongodb://localhost:27017'
const url = 'mongodb+srv://ericvu:dhdkmvl5@eric-dev-cluster-zlepn.mongodb.net/fridgedb?retryWrites=true'

const dbName = 'fridgedb'


const browseCategory = (db, user, category, callback) => {
  const user_id = ObjectID(user);
  let user_cursor = db.collection('users').findOne({_id: user_id})
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


const getOwners = (db, id, callback) => {
  const fridge_id = ObjectID(id);
  let categoryresults = db.collection('fridges').findOne({_id: fridge_id}, {fields: {_id: 0, owners: 1}}, (err, res) => {
    assert.equal(null, err);
    callback(res.owners);

  })
}

const browseAll = (db, fridge, callback) => {
  const fridge_id = ObjectID(fridge);
  let categoryresults = db.collection('fridges').findOne({_id: fridge_id}, {fields: {_id: 0, contents: 1}}, (err, res) => {
    assert.equal(null, err);
    callback(res.contents);

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
      res.send(results[0]['contents']);
    })
  });


});

router.post('/owners', function(req, res, next) {
  const id = req.body.id;
  MongoClient.connect(url, (err, client) => {
    assert.equal(null, err);
    console.log("Connected successfully to server");

    const db = client.db(dbName);
    let r = getOwners(db, id, (results) => {
      client.close();
      console.log(results);
      res.send(results);
    })
  });


});

router.post('/all', function(req, res, next) {
  const fridge = req.body.fridge;
  MongoClient.connect(url, (err, client) => {
    assert.equal(null, err);
    console.log("Connected successfully to server");

    const db = client.db(dbName);
    let r = browseAll(db, fridge, (results) => {
      client.close();
      console.log(results);
      res.send(results);
    })
  });


});

module.exports = router;

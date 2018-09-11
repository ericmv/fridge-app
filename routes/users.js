var express = require('express');
var router = express.Router();
const crypto = require('crypto');

const MongoClient = require('mongodb').MongoClient;
ObjectID = require('mongodb').ObjectID
const assert = require('assert');

const url = 'mongodb://localhost:27017'

const dbName = 'fridgedb'


const generateSession = (db, user, fridge, callback) => {
  const session_id = crypto.randomBytes(48, (err, buffer) => {
    const token = buffer.toString('hex');
    const session = {
      _id: token,
      user_id: user,
      fridge_id: fridge
    }
    db.collection('sessions').insertOne(session)
    .then((res) => {
      callback(session)
    })
    .catch((err) => {
      console.log(err)
      callback(null)
    })
  })

}

const validateUser = (db, user, password, callback) => {
  console.log(user);
  console.log(password);
  let users = db.collection('users').findOne({username: user, password: password}, (err, res) => {
    assert.equal(null, err);
    generateSession(db, res._id, res.fridge, callback);
  })
}

const validateSession = (db, session, user, callback) => {
  let users = db.collection('users').findOne({_id: session}, (err, res) => {
    assert.equal(null, err);
    callback(res);
  })
}



/* GET users listing. */
router.post('/login', function(req, res, next) {

  const user = req.body.username;
  const password = req.body.password;

  MongoClient.connect(url, (err, client) => {
    assert.equal(null, err);
    console.log("Connected successfully to server");

    const db = client.db(dbName);
    let r = validateUser(db, user, password, (results) => {
      client.close();
      console.log(results);
      res.json(results);
    })
  });
});

router.post('/validateSession', function(req, res, next) {

  const session = req.body.session;

  MongoClient.connect(url, (err, client) => {
    assert.equal(null, err);
    console.log("Connected successfully to server");

    const db = client.db(dbName);
    let r = validateSession(db, session, user, (results) => {
      client.close();
      console.log(results);
      res.json(results);
    })
  });
});


module.exports = router;

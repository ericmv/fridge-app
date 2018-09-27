var express = require('express');
var router = express.Router();
const crypto = require('crypto');

const MongoClient = require('mongodb').MongoClient;
ObjectID = require('mongodb').ObjectID
const assert = require('assert');

// const url = 'mongodb://localhost:27017'

const url = 'mongodb+srv://ericvu:dhdkmvl5@eric-dev-cluster-zlepn.mongodb.net/fridgedb?retryWrites=true'

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

const registerUser = (db, email, password, callback) => {
  let users = db.collection('users').findOne({email: email}, (err, res) => {
    console.log(res)
    callback("AYO")
  })
}

const validateUser = (db, email, password, callback) => {
  console.log(email);
  console.log(password);
  let users = db.collection('users').findOne({email: email, password: password}, (err, res) => {
    assert.equal(null, err);
    generateSession(db, res._id, res.fridge, callback);
  })
}

const validateSession = (db, session_id, callback) => {
  let session = db.collection('sessions').findOne({_id: session_id}, (err, res) => {
    assert.equal(null, err);
    console.log(res)
    callback(res);
  })
}

const logout = (db, session_id, callback) => {
  let status = db.collection('sessions').deleteOne({_id: session_id}, (err,res) => {
    assert.equal(null, err);
    callback(res);
  })
}

const info = (db, id, callback) => {
  let status = db.collection('users').findOne({_id: ObjectID(id)}, (err,res) => {
    assert.equal(null, err);
    callback(res);
  })
}

const update = (db, id, info, callback) => {
  const fields = info;
  let status = db.collection('users').updateOne({_id: ObjectID(id)}, fields, (err,res) => {
    assert.equal(null, err);
    callback(res);
  })
}

/* GET users listing. */
router.post('/register', function(req, res, next) {

  const email = req.body.email;
  const password = req.body.password;

  MongoClient.connect(url, (err, client) => {
    assert.equal(null, err);
    console.log("Connected successfully to server");

    const db = client.db(dbName);
    let r = registerUser(db, email, password, (results) => {
      client.close();
      console.log(results);
      res.send(results);
    })
  });
});

router.post('/login', function(req, res, next) {

  const email = req.body.email;
  const password = req.body.password;

  MongoClient.connect(url, (err, client) => {
    assert.equal(null, err);
    console.log("Connected successfully to server");

    const db = client.db(dbName);
    let r = validateUser(db, email, password, (results) => {
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
    let r = validateSession(db, session, (results) => {
      client.close();
      console.log(results);
      res.json(results);
    })
  });
});

router.post('/logout', function(req, res, next) {

  const session = req.body.session;

  MongoClient.connect(url, (err, client) => {
    assert.equal(null, err);
    console.log("Connected successfully to server");

    const db = client.db(dbName);
    let r = logout(db, session, (results) => {
      client.close();
      res.json(results);
    })
  });
});

router.post('/info', function(req, res, next) {

  const id = req.body.id;

  MongoClient.connect(url, (err, client) => {
    assert.equal(null, err);
    console.log("Connected successfully to server");

    const db = client.db(dbName);
    let r = info(db, id, (results) => {
      client.close();
      res.json(results);
    })
  });
});

router.post('/update', function(req, res, next) {

  const info = req.body.info;

  MongoClient.connect(url, (err, client) => {
    assert.equal(null, err);
    console.log("Connected successfully to server");

    const db = client.db(dbName);
    let r = update(db, info, (results) => {
      client.close();
      res.json(results);
    })
  });
});


module.exports = router;

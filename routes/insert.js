var express = require('express');
var router = express.Router();

const MongoClient = require('mongodb').MongoClient;
ObjectID = require('mongodb').ObjectID
const assert = require('assert');

const url = 'mongodb://localhost:27017'


const dbName = 'fridgedb'

const insertItem = (db, user, category, name, qty, unit, exp, callback) => {
  const user_id = ObjectID(user);
  console.log("USERID", user_id)
  let user_cursor = db.collection('users').findOne({_id: ObjectID(user)})
  .then(res => {
    const fridge_id = res.fridge;
    const item = {
      name: name,
      category: category,
      quantity: qty,
      unit: unit,
      exp: exp,
      owner_id: res._id,
      owner_name: res.first_name,
      item_id: new ObjectID()
    }
    let categoryresults = db.collection('fridges').updateOne({_id: fridge_id}, {$push: {contents: item}});
    callback("success");
  })
  .catch()
}

const insertUser = (db, user_id, user_first_name, fridge_id, callback) => {
  const owner = {
    user_id: user_id,
    name: user_first_name
  }

  let categoryresults = db.collection('fridges').updateOne({_id: fridge_id}, {$push: {owners: owner}});
  callback("success");
}

const insertFridge = (db, user, callback) => {
  const user_id = ObjectID(user);
  db.collection('users').findOne({_id: user_id})
  .then((res) => {
    let fridge = {
      contents: [],
      owners: [{user_id: user_id, name: res.name}]
    }
    let user_cursor = db.collection('fridges').insertOne(fridge)
    .then((results) => {
      callback(results)
    })
  })
  .catch((err) => {
    callback(null)
  })

}



/* GET users listing. */
router.post('/item', function(req, res, next) {
  const name = req.body.name;
  const qty = req.body.qty;
  const unit = req.body.unit;
  const exp = req.body.exp; //need to do conversions with expiration

  const category = req.body.category;
  const user = req.body.user;

  MongoClient.connect(url, (err, client) => {
    assert.equal(null, err);
    console.log("Connected successfully to server");

    const db = client.db(dbName);
    let r = insertItem(db, user, category, name, qty, unit, exp, (results) => {
      client.close();
      console.log(results);
      res.send(results);
    })
  });
});

router.post('/fridge', function(req, res, next) {
  const user = req.body.user;

  MongoClient.connect(url, (err, client) => {
    assert.equal(null, err);
    console.log("Connected successfully to server");

    const db = client.db(dbName);
    let r = insertFridge(db, user, (results) => {
      client.close();
      console.log(results);
      res.send(results);
    })
  });
});

module.exports = router;

var express = require('express');
var router = express.Router();

const MongoClient = require('mongodb').MongoClient;
ObjectID = require('mongodb').ObjectID
const assert = require('assert');
const url = 'mongodb://localhost:27017'
const dbName = 'fridgedb'


const update = (db, user, item, field, value, callback) => {
  const user_id = ObjectID(user);
  let user_cursor = db.collection('users').findOne({_id: ObjectID(user)})
  .then(res => {
    const fridge_id = res.fridge;
    let results;
    if (field === "quantity") {
      results = db.collection('fridges').updateOne({_id: fridge_id, "contents.item_id": item},
      {$set: {"contents.$.quantity": value}});
    }
    else if (field === "exp") {
      results = db.collection('fridges').updateOne({_id: fridge_id, "contents.item_id": item},
      {$set: {"contents.$.exp": value}});
    }
    else if (field === "units") {
      results = db.collection('fridges').updateOne({_id: fridge_id, "contents.item_id": item},
      {$set: {"contents.$.units": value}});
    }
    else if (field === "name") {
      results = db.collection('fridges').updateOne({_id: fridge_id, "contents.item_id": item},
      {$set: {"contents.$.name": value}});
    }
    else if (field === "owner") {
      results = db.collection('fridges').updateOne({_id: fridge_id, "contents.item_id": item},
      {$set: {"contents.$.owner_id": value}});
    }

    callback("success")
  })
  .catch()
}

/* GET users listing. */
router.post('/', function(req, res, next) {
  const user = req.body.user;
  console.log(user);
  const item = req.body.item;
  const field = req.body.field;
  const value = req.body.value;

  MongoClient.connect(url, (err, client) => {
    assert.equal(null, err);
    console.log("Connected successfully to server");

    const db = client.db(dbName);
    let r = update(db, user, item, field, value, (results) => {
      client.close();
      console.log(results);
      res.send(results);

    })
  });
});


module.exports = router;

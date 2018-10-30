var express = require('express');
var router = express.Router();

const MongoClient = require('mongodb').MongoClient;
ObjectID = require('mongodb').ObjectID
const assert = require('assert');
const url = 'mongodb://localhost:27017'

const dbName = 'fridgedb'


const update = (db, fridge, item_id, item, callback) => {
  const fridge_id = ObjectID(fridge);
  let results;
  results = db.collection('fridges').updateOne({"contents.item_id": ObjectID(item_id)},
  {$set: {
    "contents.$.quantity": item.quantity,
    "contents.$.category": item.category,
    "contents.$.name": item.name,
    "contents.$.exp": item.exp,
    "contents.$.unit": item.unit,
    "contents.$.owner_name": item.owner_name,
    "contents.$.owner_id": item.owner_id,
    }
  }, (err, res) => {
    assert.equal(err, null);
    callback(res);
  });


}

/* GET users listing. */
router.post('/', function(req, res, next) {
  const fridge = req.body.fridge;
  const item_id = req.body.item_id;
  const item = req.body.item;

  MongoClient.connect(url, (err, client) => {
    assert.equal(null, err);
    console.log("Connected successfully to server");

    const db = client.db(dbName);
    let r = update(db, fridge, item_id, item, (results) => {
      client.close();
      console.log(results);
      res.send(results);

    })
  });
});


module.exports = router;

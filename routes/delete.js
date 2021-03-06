var express = require('express');
var router = express.Router();

const MongoClient = require('mongodb').MongoClient;
ObjectID = require('mongodb').ObjectID
const assert = require('assert');

const url = 'mongodb://localhost:27017'


const dbName = 'fridgedb'

const deleteItem = (db, item, callback) => {
  let categoryresults = db.collection('fridges').updateOne({}, {$pull: {contents: {item_id: ObjectID(item)}}}, (err, res) => {
    assert.equal(null, err);
    console.log(res);
  });
  callback("success");
}

/* GET users listing. */
router.post('/item', function(req, res, next) {
  const item = req.body.item

  MongoClient.connect(url, (err, client) => {
    assert.equal(null, err);
    console.log("Connected successfully to server");

    const db = client.db(dbName);
    let r = deleteItem(db, item, (results) => {
      client.close();
      console.log(results);
      res.send(results);
    })
  });
});


module.exports = router;

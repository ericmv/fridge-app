var express = require('express');
var router = express.Router();

const MongoClient = require('mongodb').MongoClient;
ObjectID = require('mongodb').ObjectID
const assert = require('assert');

const url = 'mongodb://localhost:27017'

const dbName = 'fridgedb'

const insertItem = (db, user, category, name, qty, unit, exp, callback) => {
  const user_id = ObjectID(user);
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
      item_id: new ObjectID()
    }
    let categoryresults = db.collection('fridges').updateOne({_id: fridge_id}, {$push: {contents: item}});
    callback("success");
  })
  .catch()
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


module.exports = router;

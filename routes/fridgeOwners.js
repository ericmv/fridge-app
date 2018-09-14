var express = require('express');
var router = express.Router();

const MongoClient = require('mongodb').MongoClient;
ObjectID = require('mongodb').ObjectID
const assert = require('assert');

// const url = 'mongodb://localhost:27017'
const url = 'mongodb+srv://ericvu:dhdkmvl5@eric-dev-cluster-zlepn.mongodb.net/fridgedb?retryWrites=true'


const dbName = 'fridgedb'

const getOwners = (db, fridge, callback) => {
  const fridge_id = ObjectID(fridge)
  let categoryresults = db.collection('fridges').findOne({_id: fridge_id}, {fields: {owners: 1, _id:0}}, (err, res) => {
    assert.equal(null, err);
    callback(res);
  })
}


/* GET users listing. */
router.post('/', function(req, res, next) {

  const fridge = req.body.fridge;

  MongoClient.connect(url, (err, client) => {
    assert.equal(null, err);
    console.log("Connected successfully to server");

    const db = client.db(dbName);
    let r = getOwners(db, fridge, (results) => {
      client.close();
      console.log(results);
      res.json(results.owners);
    })
  });
});


module.exports = router;

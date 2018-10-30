var express = require('express');
var router = express.Router();


const MongoClient = require('mongodb').MongoClient;
ObjectID = require('mongodb').ObjectID
const assert = require('assert');
const nodemailer = require('nodemailer')
// const url = 'mongodb://localhost:27017'

const url = 'mongodb+srv://ericvu:dhdkmvl5@eric-dev-cluster-zlepn.mongodb.net/fridgedb?retryWrites=true'
const dbName = 'fridgedb'

// nodemailer
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'noreplyfridge@gmail.com',
    pass: 'fridge4lyfe'
  }
});


// encryption
var crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    password = 'd6F3Efeq';

function encrypt(text){
  var cipher = crypto.createCipher(algorithm,password)
  var crypted = cipher.update(text,'utf8','hex')
  crypted += cipher.final('hex');
  return crypted;
}

function decrypt(text){
  var decipher = crypto.createDecipher(algorithm,password)
  var dec = decipher.update(text,'hex','utf8')
  dec += decipher.final('utf8');
  return dec;
}
//

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

const sendInvite = (db, invited, fridge_id, sender, callback) => {
  const invite = {
    invited: invited,
    sender: sender,
    fridge_id: fridge_id
  }

  db.collection('invites').insertOne(invite)
  .then((res) => {
    db.collection('users').findOne({username: invited})
    .then((data) => {
      const email = data.email;
      const invited_id = data._id;
      const params = invited_id + "-" + data.first_name + "-" + fridge_id;
      const encrypted_params = encrypt(params);
      const link = 'http://192.168.1.18:3000/users/acceptInvite?params=' + encrypted_params;

      var mailOptions = {
        from: 'ericvooo@gmail.com',
        to: email,
        subject: 'Invite to join fridge',
        html: '<h1>Welcome</h1><p>Please click <a href=' + link + '>here</a> to accept invitation</p>'
      }

      transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
          console.log(error);
          callback(null)
        } else {
          console.log('Email sent: ' + info.response);
          callback("Invite Sent!");
        }
      });

    })
  })
  .catch((err) => {
    callback(null);
  })

}

const acceptInvite = (db, user_id, user_first_name, fridge_id, callback) => {
  console.log(user_first_name, "first_name")
  const owner = {
    user_id: user_id,
    name: user_first_name
  }

  db.collection('fridges').updateOne({_id: ObjectID(fridge_id)}, {$push: {owners: owner}})
  .then((res) => {
    console.log(fridge_id);
    callback("success");
  })
  .catch((err) => {
    console.log(err);
    callback(null);
  })

}

const registerUser = (db, email, password, username, first_name, last_name, callback) => {
  let users = db.collection('users').findOne({email: email}, (err, res) => {
    if (res == null) {
      console.log("email available")
      let user = {
        email: email,
        password: password,
        username: username,
        first_name: first_name,
        last_name: last_name,
      }
      db.collection('users').insertOne(user, (err, res) => {
        assert.equal(err, null);
        generateSession(db, user._id, null, callback)
      })
    }
    else {
      console.log("email unavailable")
      callback({})
    }
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
  const username = req.body.username;
  const first_name = req.body.first_name;
  const last_name = req.body.last_name;

  MongoClient.connect(url, (err, client) => {
    assert.equal(null, err);
    console.log("Connected successfully to server");

    const db = client.db(dbName);
    let r = registerUser(db, email, password, username, first_name, last_name, (results) => {
      client.close();
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

router.post('/invite', function(req, res, next) {

  const sender = req.body.sender_username;
  const invited = req.body.invited_username;
  const fridge_id = req.body.fridge_id;

  MongoClient.connect(url, (err, client) => {
    assert.equal(null, err);
    console.log("Connected successfully to server");

    const db = client.db(dbName);
    let r = sendInvite(db, invited, fridge_id, sender, (results) => {
      client.close();
      res.json(results);
    })
  });
});

router.get('/acceptInvite', function(req, res, next) {

  const encrypted_params = req.query.params;
  const decrypted = decrypt(encrypted_params).split("-");

  const user_id = decrypted[0];
  const user_first_name = decrypted[1];
  console.log(user_first_name);
  const fridge_id = decrypted[2];


  MongoClient.connect(url, (err, client) => {
    assert.equal(null, err);
    console.log("Connected successfully to server");

    const db = client.db(dbName);
    let r = acceptInvite(db, user_id, user_first_name, fridge_id, (results) => {
      client.close();
      res.json(results);
    })
  });
});


module.exports = router;

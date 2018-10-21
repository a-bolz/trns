const dotenv = require('dotenv').config();
const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const bodyParser = require('body-parser');
const passport = require('passport');
const OAuth2Strategy = require('passport-oauth2');
const mongodb = require("mongodb");
const objectID = mongodb.ObjectID;


passport.use(new OAuth2Strategy({
  authorizationURL: 'https://app.teamleader.eu/oauth2/authorize',
  tokenURL: 'https://app.teamleader.eu/oauth2/access_token',
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: "http://localhost:5000/auth/example/callback",
},
  function(accessToken, refreshToken, profile, cb) {
    console.log(accessToken, '\n\n', refreshToken, '\n\n', profile, '\n\n', cb)
  //  User.findOrCreate({ exampleId: profile.id }, function (err, user) {
  //    return cb(err, user);
  //  });
  }
));

const app = express()


var db;

mongodb.MongoClient.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/textwerk_dev", function (err, client) {
  if (err) {
    process.exit(1);
  }

  //save database object from the callback for reuse
  db = client.db();
  console.log("Database connection ready");


  //initialize the app.
  const server = app.listen(process.env.PORT || 5000, function () {
    const port = server.address().port;
    console.log("App now running on port", port);
  });
});

app.use(express.static(path.join(__dirname, 'public')))
.use(bodyParser.json())
.set('views', path.join(__dirname, 'views'))
.set('view engine', 'ejs')
.get('/auth/example', passport.authenticate('oauth2'))
.get(
  '/auth/example/callback', 
  passport.authenticate('oauth2', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
 })
.get('/', (req, res) => res.render('pages/index'))
.get('/authenticate', (req, res) => res.render('pages/authenticate'))
.post('/onzeapi', (req, res) => {
  res.send('thanks')
})
.get('/milan', (req, res) => {
  db.collection('milan').find({}).toArray(function(err, docs) {
    if (err) {
      console.log(err) 
    } else {
      res.status(200).json(docs)
    }
  })
})

//Webhook Post Data
//{
//  type: 'deal.moved',
//  subject: {
//    type: 'deal', 
//    id: '60592a1b-8c7d-017e-a161-feaee35686f7' 
//  },
//  account: {
//    type: 'account', 
//    id: '0831327a-9e1a-0e3c-a85f-f3b3b911d0e8' 
//  }
//}


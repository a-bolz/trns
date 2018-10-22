const dotenv = require('dotenv').config();
const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const bodyParser = require('body-parser');
const passport = require('passport');
const OAuth2Strategy = require('passport-oauth2');
const mongoose = require('mongoose')
const mongodb = require("mongodb");
const objectID = mongodb.ObjectID;
const calls = require('./services/calls')
const url = require('url')
const axios = require('axios')
const router = express.Router()


const app = express()

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/textwerk_dev")
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'))
db.once('open', function() {
  console.log('db connection established')
  const server = app.listen(process.env.PORT || 5000, function () {
    const port = server.address().port;
    console.log("App now running on port", port);
  });
})

app.use(express.static(path.join(__dirname, 'public')))
  .use(bodyParser.json())
  .use(passport.initialize())
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/auth/example', (req, res) => {
    res.redirect(url.format({
      pathname: "https://app.teamleader.eu/oauth2/authorize",
      query: {
        client_id: process.env.CLIENT_ID,
        response_type: 'code',
        redirect_uri: process.env.REDIRECT_URI || 'http://localhost:5000/auth/example/callback',
      }
    }));
  })
  .get('/auth/example/callback', (req, res) => {
    axios({
      method: 'post',
      url: 'https://app.teamleader.eu/oauth2/access_token',
      headers: {'content-type': 'application/json'},
      data: {
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        redirect_uri: process.env.REDIRECT_URI || 'http://localhost:5000/auth/example/callback',
        code: req.query.code,
        grant_type: 'authorization_code'
      }
    }).then((response) => {
      db.collection('tokens').drop()
      db.collection('tokens').insert({ 
        token_type: response.data.token_type, 
        expires_in: response.data.expires_in, 
        access_token: response.data.access_token, 
        refresh_token: response.data.refresh_token })
      res.send(`authentication ok: access_token: ${response.data.access_token}, refresh_token: ${response.data.refresh_token}`)
    }).catch((error) => {
      console.log(error)
    })
  })
  .get('/see_latest', (req, res) => {
    
  })
  .get('/', (req, res) => res.render('pages/index'))
  .get('/authenticate', (req, res) => res.render('pages/authenticate'))
  .post('/onzeapi', (req, res) => {
    res.send('thanks')
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


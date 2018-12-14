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
const auth = require('./controllers/authentication')
const teamleader = require('./controllers/teamleader')

const app = express()

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/textwerk_dev")
mongoose.Promise = global.Promise;
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
app.use(bodyParser.json())
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use('/auth', auth)
app.use('/teamleader', teamleader)

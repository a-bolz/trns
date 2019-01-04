const dotenv = require('dotenv').config();
const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5000;
const bodyParser = require('body-parser');
const calls = require('./services/calls');
const url = require('url');
const axios = require('axios');
const auth = require('./controllers/authentication');
const teamleader = require('./controllers/teamleader');
const feedback = require('./controllers/feedback');
const mongoose = require('mongoose');
const mongoDB = process.env.MONGODB_URI;
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const app = express();

app.listen(process.env.PORT || 5000);
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.all('*', function(req, res, next) {
   res.header("Access-Control-Allow-Origin", "*");
   res.header("Access-Control-Allow-Headers", "X-Requested-With");
   next();
});
app.use('/auth', auth);
app.use('/teamleader', teamleader);
app.use('/feedback', feedback);

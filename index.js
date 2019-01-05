const dotenv = require('dotenv').config();
const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5000;
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
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

const Deal = require('./models/deal');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');
const prepareDeals = require('./services/files');

const app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.listen(process.env.PORT || 5000);
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json(), function(req, res, next) {
  console.log('bodyparser', req);
  next();
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'foo', resave: false, saveUninitialized: false}));
app.use(cookieParser('foo'));
app.use(passport.initialize());
app.use(passport.session());
app.use('/auth', auth);
app.use('/teamleader', teamleader);
app.use('/feedback', feedback);

passport.use(new LocalStrategy(
  function(username, password, done) {
    console.log('using the strategy');
    User.findOne({ userName: username }, function (err, user) {
      console.log(user);
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      user.comparePassword(password, function(err, isCorrect) {
        if (err) throw err;
        if (isCorrect) {
          return done(null, user);
        } else {
          return done(null, false, { message: 'Incorrect password.' });
        }
      });
    });
  }
));

passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  User.findById(id, function(err, user) {
    if (err) { return cb(err); }
    console.log('jahoor');
    cb(null, user);
  })
});


app.get('/login',
  function(req, res) {
    res.render('login');
  });

app.post('/login',
  async function(req, res, next) {
    console.log(req.body);
    passport.authenticate('local', async function (error, user, info) {
      console.log('erro',error);
      console.log('user',user);
      console.log('info',info);

      if (error) {
        console.log(1);
        res.status(401).send(error);
      } else if (!user) {
        console.log(2);
        res.status(401).send(info);
      } else {
        console.log(3);
        next();
      }

     // res.status(401).send(info);
    })(req, res);
  },
  async function (req, res) {
    try {
    const deals = await Deal.find({});
    res.send(deals);
    } catch (error) {
      console.log(error);
    }
  }
)

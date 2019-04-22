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
const expressVue = require("express-vue");
const jwt = require('jsonwebtoken');
const user = require('./models/user.js');
const withAuth = require('./middleware.js');
const jsoncsv = require('express-json-csv')(express);
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;

const Deal = require('./models/deal');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');
const prepareDeals = require('./services/files');
const {debug} = require('./services/log');

const app = express();
const expressVueMiddleware = expressVue.init({
  rootPath: path.join(__dirname, '/vue'),
});


app.use(expressVueMiddleware);
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

app.get('/', function(req, res) {
  res.render('root');
});

app.get('/secret', withAuth, (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ secret: 1 }));
})


app.post('/register', (req, res) => {
  const { email, password, userName } = req.body;
  const user = new User({ email, password, userName });
  user.save((err) => {
    if (err) {
      res.status(500).send("error registering user. please try again");
    } else {
      res.status(200).send("Welcome new user");
    }
  })
});

const secret = 'supersecretsecretshh';
app.post('/user/authenticate', (req, res) => {
  const { userName, password } = req.body;
  user.findOne({userName}, (err, user) => {
    if (err) {
      console.error(err);
      res.status(500)
        .json({
          error: 'Internal error please try again'
        });
    } else if (!user) {
      res.status(401)
        .json({
          error: 'Incorrect username or password'
        });
    } else {
      user.comparePassword(password, (err, same) => {
        if (err) {
          res.status(500)
            .json({
              error: 'Incorrect username or password'
            })
        } else {
          const payload =  { userName };
          const token = jwt.sign(payload, secret, {
            expiresIn: '1h'
          })
          res.cookie('token', token, { httpOnly: true })
            .sendStatus(200);
        }
      })
    }
  })
})

app.get('/login',
  function(req, res) {
    res.render('login');
  });

app.post('/login',
  async function(req, res, next) {
    passport.authenticate('local', async function (error, user, info) {

      if (error) {
        res.status(401).send(error);
      } else if (!user) {
        res.status(401).send(info);
      } else {
    const deals = await Deal.find({}).lean();
      res.csv(deals,
            {fields:['dealId', 'dealTitle', 'companyName', 'companyId', 'contactFirstName', 'contactLastName', 'contactId', 'contactEmail', 'status', 'feedback', 'rating']})
      }

     // res.status(401).send(info);
    })(req, res);
  },
)

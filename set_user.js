const dotenv = require('dotenv').config();
const mongoose = require('mongoose');
const mongoDB = process.env.MONGODB_URI;
console.log(mongoDB);
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
const User = require('./models/user');

var firstUser = new User({
  userName: 'testuser',
  password: 'Password123',
  email: 'tester@testemail.com'
});

firstUser.save(function(err) {
  if (err) throw err;
});

User.findOne({ userName: 'testuser'}, function(err, user) {
  if (err) throw err;
  user.comparePassword('Password123', function(err, isMatch) {
    if (err) throw err;
    console.log('Password123', isMatch);
  });
  user.comparePassword('123Password', function(err, isMatch) {
    if (err) throw err;
    console.log('Password123', isMatch);
  });
})

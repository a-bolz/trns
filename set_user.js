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
  userName: 'admin',
  password: 'admin',
  email: 'admin@example.com'
});

console.log(firstUser);

firstUser.save(function(err) {
  if (err) {
   console.log('error saving user');
    throw err;
  }
});

User.findOne({ userName: 'admin'}, function(err, user) {
  if (err) throw err;
  user.comparePassword('admin', function(err, isMatch) {
    if (err) throw err;
    console.log('admin', isMatch);
  });
  user.comparePassword('aadmin', function(err, isMatch) {
    if (err) throw err;
    console.log('aadmin', isMatch);
  });
})

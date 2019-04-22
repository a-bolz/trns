const mongoose = require('mongoose');
const { Schema } = mongoose;
bcrypt = require('bcryptjs');
SALT_WORK_FACTOR = 10;
const mongooseUniqueValidator = require('mongoose-unique-validator');

const UserSchema = new Schema({
  userName: {type: String, required: true},
  password: {type: String, required: true},
  email: {type: String, required: true, unique: true},
});

UserSchema.pre('save', function(next) {
  var user = this;

  //only has the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();

  //generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) return next(err);

    // override the cleartext password with the hased one
    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) return next(err);

      // override the cleartext password with the hashed one
      user.password = hash;
      next();
    });
  });
});

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

UserSchema.plugin(mongooseUniqueValidator);
module.exports = mongoose.model('User', UserSchema);

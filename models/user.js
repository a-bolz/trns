const mongoose = require('mongoose')
const { Schema } = mongoose;
const mongooseUniqueValidator = require('mongoose-unique-validator');

const schema = new Schema({
  firstName: {type: String, required: true},
  lastName: {type: String, required: true},
  password: {type: String, required: true},
  email: {type: String, required: true, unique: true},
});

schema.plugin(mongooseUniqueValidator);


mongoose.model('User', schema);

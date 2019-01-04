const dotenv = require('dotenv').config();
const mongoose = require('mongoose');
const mongoDB = process.env.MONGODB_URI;
console.log(mongoDB);
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const { Schema } = mongoose;
const dealSchema = new Schema({
  firstName: {type: String, required: true},
  lastName: {type: String, required: true},
  email: {type: String, required:true},
  deal_id: {type: String, index: {unique: true}, required:true},
  email_sent: {type: Boolean, required: true, default: false},
  feedback: {type: String, required: false},
  rating: {type: Number, required: false}
});

dealSchema.statics.findByIdd = function(id, cb) {
  return this.find({ deal_id: id }, cb);
}

const Deal = db.model('Deal', dealSchema);
const e = new Deal({firstName: 'andrears', lastName: 'Bolz', email: 'andreasbolz@gmail.com', deal_id: 5, email_sent: true,});
e.save((e) => console.log('1',e));

Deal.findByIdd(5, (err, deals) => {
  if (err) return console.log('2',err);
  console.log('3',deals[0].rating);
});



const mongoose = require('mongoose');
const { Schema } = mongoose;
const dealSchema = new Schema({
  firstName: {type: String, required: false},
  lastName: {type: String, required: false},
  email: {type: String, required:false},
  deal_id: {type: String, index: {unique: true}, required:true},
  email_sent: {type: Boolean, required: false, default: false},
  feedback: {type: String, required: false},
  rating: {type: Number, required: false}
});

dealSchema.statics.findByIdd = function(id, cb) {
  return this.find({ deal_id: id }, cb);
}

module.exports = mongoose.model('Deal', dealSchema);

const mongoose = require('mongoose');
const { Schema } = mongoose;
const dealSchema = new Schema({
  dealId: {type: String, index: {unique: true}, required:true},
  dealTitle: {type: String, required: false},
  companyName: {type: String, required: true},
  companyId: {type: String, required: true},
  contactFirstName: {type: String, required: true},
  contactLastName: {type: String, required: true},
  contactId: {type: String, required: true},
  contactEmail: {type: String, required: true},
  status: { type: String, required: true, default: 'Deal Won'},
  feedback: {type: String, required: false},
  rating: {type: Number, required: false},
});

dealSchema.statics.findByDealId = function(id, cb) {
  return this.findOne({ dealId: id }, cb);
}

dealSchema.statics.findOrCreate = async function(contact, deal, company) {
  const {first_name, last_name} = contact;
  const contactId = contact.id;
  const email = contact.emails[0].email;
  const dealId = deal.id;
  const {title} = deal;
  const companyName = company.name;
  const companyId = company.id;
  const existing = await this.findByDealId(dealId, function(err, deal) {
    if (err) throw(err);
    return deal;
  });
  if (existing) return existing;
  let newDeal = new this({
    dealId: dealId,
    dealTitle: title,
    companyName: companyName,
    companyId: companyId,
    contactFirstName: first_name,
    contactLastName: last_name,
    contactId: contactId,
    contactEmail: email,
  });
  console.log('deze deal', newDeal);
  newDeal.save(function(err) {
    if (err) throw(err);
  });
  return newDeal;
}

module.exports = mongoose.model('Deal', dealSchema);

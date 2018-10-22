const mongoose = require('mongoose')

//const dealSchema = mongoose.Schema({
//  id: String,
//  title: String,
//  reference: String,
//  status: String,
//  customer: {
//    type: {type: String},
//    id: String
//  },
//  lead: {
//    customer: {},
//    contact_person: {},
//  },
//  estimated_value: {},
//  estimated_closing_date: {},
//  estimated_probability: Number,
//  closed_at: Date,
//  created_at: Date,
//  updated_at: Date,
//  current_phase: {
//    type: { type: String },
//    id: String,
//  },
//  source: {
//    type: { type: String },
//    id: String,
//  },
//  quotations: Array,
//  responsible_user: {
//    type: { type: String },
//    id: String,
//  },
//  department: {
//    type: { type: String },
//    id: String,
//  },
//  phase_history: [{}],
//  custom_fields: [{}],
//})
const dealSchema = mongoose.Schema({ tl_data: {}})

module.exports = mongoose.model('Deal', dealSchema)

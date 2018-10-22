const mongoose = require('mongoose')

const tokenSchema = mongoose.Schema({
  token_type: String,
  expires_in: Number,
  access_token: String,
  refresh_token: String,
})

module.exports = mongoose.model('Token', tokenSchema)

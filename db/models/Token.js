const mongoose = require('mongoose')

const tokenSchema = mongoose.Schema(
  {
    token_type: String,
    expires_in: Number,
    access_token: String,
    refresh_token: String,
  },
  {
    timestamps: {
      createdAt: 'created_at'
    }
  }
)

tokenSchema.methods.findLatest = function(cb) {
  return this.model('Token').findOne().sort({ created_at: -1}, cb)
}

//tokenSchema.statics.findLatest = function findLatest (

module.exports = mongoose.model('Token', tokenSchema)

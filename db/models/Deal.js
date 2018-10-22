const mongoose = require('mongoose')

const dealSchema = mongoose.Schema({
  type: String,
  subject: {
    type: String,
    id: String,
  },
  account: {
    type: String,
    id: String,
  }
}

module.exports = mongoose.model('Deal' dealSchema)

//Webhook Post Data
//{
//  type: 'deal.moved',
//  subject: {
//    type: 'deal', 
//    id: '60592a1b-8c7d-017e-a161-feaee35686f7' 
//  },
//  account: {
//    type: 'account', 
//    id: '0831327a-9e1a-0e3c-a85f-f3b3b911d0e8' 
//  }
//}

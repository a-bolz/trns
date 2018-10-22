const mongoose = require('mongoose')

const { Schema } = mongoose;

const UsersSchema = new Schema({
  email: String,
  id: String,
  displayName: String,
  name: {
    familyName: String,
    givenName: String,
    middleName: String,
  },
  emails: [

  ],
})


mongoose.model('Users', UsersSchema);

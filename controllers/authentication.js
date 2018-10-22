const express = require('express')
const router = express.Router()
const axios = require('axios')
const url = require('url')
const mongoose = require('mongoose')
const db = mongoose.connection


router.get('/', (req, res) => {
  res.redirect(url.format({
    pathname: "https://app.teamleader.eu/oauth2/authorize",
    query: {
      client_id: process.env.CLIENT_ID,
      response_type: 'code',
      redirect_uri: process.env.REDIRECT_URI || 'http://localhost:5000/auth/callback',
    }
  }));
})

router.get('/callback', (req, res) => {
  axios({
    method: 'post',
    url: 'https://app.teamleader.eu/oauth2/access_token',
    headers: {'content-type': 'application/json'},
    data: {
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      redirect_uri: process.env.REDIRECT_URI || 'http://localhost:5000/auth',
      code: req.query.code,
      grant_type: 'authorization_code'
    }
  }).then((response) => {
    db.collection('tokens').drop()
    db.collection('tokens').insert({ 
      token_type: response.data.token_type, 
      expires_in: response.data.expires_in, 
      access_token: response.data.access_token, 
      refresh_token: response.data.refresh_token })
    res.send(`authentication ok: access_token: ${response.data.access_token}, refresh_token: ${response.data.refresh_token}`)
  }).catch((error) => {
    console.log(error)
  })
})

module.exports = router

const express = require('express')
const router = express.Router()
const url = require('url')
const { tl_auth } = require('../services/calls');


router.get('/teamleader', (req, res) => {
  res.redirect(url.format({
    pathname: "https://app.teamleader.eu/oauth2/authorize",
    query: {
      client_id: process.env.TL_CLIENT_ID,
      response_type: 'code',
      redirect_uri: process.env.TL_REDIRECT_URI || 'http://localhost:5000/auth/teamleader/callback',
    }
  }));
})

router.get('/teamleader/callback', async (req, res) => {
  try {
    let token = await tl_auth.setToken(req.query.code);
    res.send(`authentication ok: access_token: ${token.access_token}, refresh_token: ${token.refresh_token}`)
  } catch (error) {
    res.send(`error authenticating: ${error}`)
  }
})

router.get('/gmail', (req, res) => {
  res.redirect(url.format({
    pathname: "https://app.gmail.eu/oauth2/authorize",
    query: {
      client_id: process.env.GMAIL_CLIENT_ID,
      response_type: 'code',
      redirect_uri: process.env.GMAIL_REDIRECT_URI || 'http://localhost:5000/auth/gmail/callback',
    }
  }));
})

router.get('/gmail/callback', async (req, res) => {
  try {
    let token = await tl_auth.setToken(req.query.code);
    res.send(`authentication ok: access_token: ${token.access_token}, refresh_token: ${token.refresh_token}`)
  } catch (error) {
    res.send(`error authenticating: ${error}`)
  }
})


module.exports = router

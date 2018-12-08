const express = require('express')
const router = express.Router()
const url = require('url')
const { tl_auth, gmail_auth } = require('../services/calls');


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
    pathname: "https://accounts.google.com/o/oauth2/auth",
    query: {
      client_id: process.env.GMAIL_CLIENT_ID,
      response_type: 'code',
      redirect_uri: process.env.GMAIL_REDIRECT_URI || 'http://localhost:5000/auth/gmail/callback',
      scope: 'https://www.googleapis.com/auth/gmail.readonly'
    }
  }));
})

router.get('/gmail/callback', async (req, res) => {
  console.log("DINGDINGDING\n\n\n\n", req.query.code);
  try {
    let token = await gmail_auth.setToken(req.query.code);
    let newtoken = await gmail_auth.refreshToken();
    res.send(`authentication ok: access_token1: ${token}, token2: ${newtoken}`)
  } catch (error) {
    res.send(`error authenticating: ${error}`)
  }
})


module.exports = router

const express = require('express')
const router = express.Router()
const url = require('url')
const { tl_auth, gmail_auth, gmail, sheets } = require('../services/calls');
const Gmail = require('node-gmail-api')
const promisify = require('promisify');
const util = require('util');
const fs = require('fs')
const readFile = util.promisify(fs.readFile);
const GMAIL_TOKEN_PATH = 'gmail_token.json';

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
      scope: 'https://www.googleapis.com/auth/gmail.compose https://www.googleapis.com/auth/drive.file'
    }
  }));
})

router.get('/gmail/callback', async (req, res) => {
  try {
    await gmail_auth.setToken(req.query.code);
    res.send('success!');
  } catch (error) {
    res.send(`error authenticating: ${error}`)
  }
})

router.get('/gmail/postdraft', async (req, res) => {
  try {
    const token = await gmail_auth.refreshToken();
    await gmail.submitDraft(token, {});
    res.send('ok');
  } catch(error) {
    res.send(error)
    console.log(error);
  }
})

router.get('/sheets/getblob', async (req, res) => {
  try {
    const token = await gmail_auth.refreshToken();
    console.log(token);
    const res = await sheets.getBlob(token);
    console.log(res.data);
  } catch(error) {
    console.log(error);
  }
})


module.exports = router

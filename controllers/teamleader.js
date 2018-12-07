const express = require('express')
const router = express.Router()
const axios = require('axios')
const url = require('url')
const calls = require('../services/calls');
const auth = calls.tl_auth;
const teamleader = calls.teamleader;

router.post('/deal_update', async (req, res) => {
  try {
    const access_token = await auth.refreshToken();
    const deals_info = await teamleader.getDealsInfo(access_token, req.body.subject.id);
    const id = deals_info.data.data.lead.customer.id;
    const contacts = await teamleader.getContactsList(access_token, { company: id })
    console.log(contacts.data.data);
  } catch(error) {
    console.log(error);
  }
})

//pass ngrok tunnel as query param in get_request
router.get('/set_webhook', async (req, res) => {
  try {
    const access_token = await auth.refreshToken();
    await teamleader.registerWebhook(access_token);
    res.redirect('/teamleader/list_webhooks');
  } catch(error) {
  }
})

router.get('/list_webhooks', async (req, res) => {
  try {
    const access_token = await auth.refreshToken();
    const webhooks = await teamleader.getWebhooks(access_token);
    res.send(webhooks.data);
  } catch(error) {
    res.send(error);
  }
})

module.exports = router

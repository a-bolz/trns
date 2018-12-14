const express = require('express')
const router = express.Router()
const axios = require('axios')
const url = require('url')
const { tl_auth, teamleader, gmail_auth, gmail } = require('../services/calls');

router.post('/deal_update', async (req, res) => {
  try {
    console.log('DATA VAN TEAMLEADER:', req.body);
    const tl_access_token = await tl_auth.refreshToken();
    const deals_info = await teamleader.getDealsInfo(tl_access_token, req.body.subject.id);
    const id = deals_info.data.data.lead.customer.id;
    const contacts = await teamleader.getContactsList(tl_access_token, { company: id })
    const gmail_access_token = await gmail_auth.refreshToken();
    const gmail_response = await gmail.submitDraft(gmail_access_token, {name: 'Milan', company: 'GrumpyOwl', addressee: 'raefir@gmail.com'});
    console.log('response van gmail', gmail_response);

  } catch(error) {
    console.log(error);
  }
})

//pass ngrok tunnel as query param in get_request
router.get('/set_webhook', async (req, res) => {
  try {
    const access_token = await tl_auth.refreshToken();
    await teamleader.registerWebhook(access_token);
    res.redirect('/teamleader/list_webhooks');
  } catch(error) {
  }
})

router.get('/list_webhooks', async (req, res) => {
  try {
    const access_token = await tl_auth.refreshToken();
    const webhooks = await teamleader.getWebhooks(access_token);
    res.send(webhooks.data);
  } catch(error) {
    res.send(error);
  }
})

module.exports = router

const express = require('express')
const router = express.Router()
const axios = require('axios')
const url = require('url')
const { tl_auth, teamleader, gmail_auth, gmail } = require('../services/calls');
const env = process.env
const Deal = require('../models/deal');

router.post('/deal_update', async (req, res) => {
  //console.log('DATA VAN TEAMLEADER:', req.body.subject.id);
  try {
    const tl_access_token = await tl_auth.refreshToken();
    const dealdata = await teamleader.getDealsInfo(tl_access_token, req.body.subject.id);
    const data = dealdata.data.data;
    if (data.status === 'won') {
      console.log(data.lead.contact_person.id);
      const tl_access_token = await tl_auth.refreshToken();
      const contact = await teamleader.getContactInfo(tl_access_token, data.lead.contact_person.id);
      console.log(contact.data.data);
 //     const deal = new Deal({firstName: 'andreas', lastName: 'bolz', email: 'andreasbolz@gmail.com', deal_id: req.body.subject.id, email_sent: false, feedback_received: false});
 //     await deal.save();
 //     console.log('saved deal:', deal);
      const token = await gmail_auth.refreshToken();
 //     await gmail.submitDraft(token, deal);
    }
//    const id = deals_info.data.data.lead.customer.id;
//    const contacts = await teamleader.getContactsList(tl_access_token, { company: id })
//    const gmail_access_token = await gmail_auth.refreshToken();
//    const gmail_response = await gmail.submitDraft(gmail_access_token, {name: 'Milan', company: 'GrumpyOwl', addressee: 'raefir@gmail.com'});
//    console.log('response van gmail', gmail_response);

  } catch(error) {
    console.log("\n\n\n\n ERROR \n\n\n\n", error.response);
  }
})

router.get('/submitdraft', async(req,res) => {
   const token = await gmail_auth.refreshToken();
  const deal = {firstName: 'andreas', email: 'andreasb@gmail.com'}
   await gmail.submitDraft(token, deal);
});

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

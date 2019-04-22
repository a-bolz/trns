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
    let tl_access_token = await tl_auth.refreshToken();
    const dealdata = await teamleader.getDealsInfo(tl_access_token, req.body.subject.id);
    const data = dealdata.data.data;
    if (data.status === 'won') {
      const company_id = data.lead.customer.id;
      const contact_id = data.lead.contact_person.id;
      tl_access_token = await tl_auth.refreshToken();
      const contact = await teamleader.getContactInfo(tl_access_token, contact_id);
      const contactdata = contact.data.data;
      tl_access_token = await tl_auth.refreshToken();
      const company = await teamleader.getCompanyInfo(tl_access_token, company_id);
      const companydata = company.data.data;
      const deal = await Deal.findOrCreate(contactdata, data, companydata);
      console.log('dit is de deal', deal);
      if (deal.status === 'Deal won') { //dan moeten we een draft submitten
        const token = await gmail_auth.refreshToken();
        let res = await gmail.submitDraft(token, deal);

        console.log('succesfull submit', res);
        if (false) {
          deal.status = "Draft submitted";
          await deal.save(function(err) {
            if (err) throw(err); 
          })
        }
      }
    }
  } catch(error) {
    console.info(error);
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
    console.log('dit sowieso eerst');
    const access_token = await tl_auth.refreshToken();
    console.log('hier nog wel', access_token);
    await teamleader.registerWebhook(access_token);
    console.log('en niet meer hier');
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

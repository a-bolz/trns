const express = require('express')
const router = express.Router()
const axios = require('axios')
const url = require('url')
const { tl_auth, teamleader, gmail_auth, gmail } = require('../services/calls');
const env = process.env
const Deal = require('../models/deal');


//: { id: 'bbd91163-7c63-0143-9665-9714406dcf4b',
//  title: 'Webpage design',
//  reference: '2',
//  status: 'open',
//  lead:
//   { customer:
//      { type: 'company', id: 'c9c8b643-88f8-0492-aa7f-495911a4d64d' },
//     contact_person:
//      { type: 'contact', id: '8df39adb-aead-032f-987a-f941e1e87692' } },
//  estimated_value: { amount: 18500, currency: 'EUR' },
//  estimated_closing_date: null,
//  estimated_probability: 0.5,
//  closed_at: null,
//  created_at: '2019-04-15T10:43:26+00:00',
//  updated_at: '2019-04-15T14:16:31+00:00',
//  current_phase:
//   { type: 'dealPhase',
//     id: '5fe2951c-c231-06fc-915e-819602e8d5be' },
//  source:
//   { type: 'dealSource',
//     id: '7d6dd695-7839-0488-9c54-285fc1c4457e' },
//  quotations: [],
//  web_url:
//   'https://app.teamleader.eu/sale_detail.php?id=bbd91163-7c63-0143-9665-9714406dcf4b',
//  responsible_user: { type: 'user', id: '81dbbdc2-e128-02a1-915b-2c9c04e3c7c4' },
//  department:
//   { type: 'department',
//     id: '55cb8b11-ee02-07a3-9f5a-a018dc5246db' },
//  phase_history:






//{ id: '8df39adb-aead-032f-987a-f941e1e87692',
//      first_name: 'Albert',
//      last_name: 'Johnson',
//      emails: [ { type: 'primary', email: 'a.johnson@verizon.com' } ],
//      salutation: null,
//      telephones: [ { type: 'mobile', number: '+1 202-585-0157' } ],
//      website: null,
//      gender: 'male',
//      birthdate: '1959-09-07',
//      iban: null,
//      bic: null,
//      national_identification_number: null,
//      language: 'en',
//      payment_term: null,
//      invoicing_preferences: { electronic_invoicing_address: null },
//      added_at: '2019-04-15T10:43:22+00:00',
//      updated_at: '2019-04-15T10:43:22+00:00',
//      web_url:
//     'https://app.teamleader.eu/contact_detail.php?id=8df39adb-aead-032f-987a-f941e1e87692',
//      remarks:
//     'CMO of Johnson\'s Cigar Shoppe. Interested in new website plus webshop. Decision maker.',
//      marketing_mails_consent: false,
//      addresses: [ { type: 'primary', address: [Object] } ],
//      companies:
//     [ { position: 'CMO', decision_maker: false, company: [Object] } ],
//      tags: [ 'client', 'hot lead' ],
//      custom_fields: [] }
//}
router.post('/deal_update', async (req, res) => {
  //console.log('DATA VAN TEAMLEADER:', req.body.subject.id);
  try {
    let tl_access_token = await tl_auth.refreshToken();
    const dealdata = await teamleader.getDealsInfo(tl_access_token, req.body.subject.id);
    const data = dealdata.data.data;
    if (data.status === 'won' || true) {
      const company_id = data.lead.customer.id;
      const contact_id = data.lead.contact_person.id;
      tl_access_token = await tl_auth.refreshToken();
      const contact = await teamleader.getContactInfo(tl_access_token, contact_id);
      const contactdata = contact.data.data;
      tl_access_token = await tl_auth.refreshToken();
      const company = await teamleader.getCompanyInfo(tl_access_token, company_id);
      const companydata = company.data.data;
      const deal = await Deal.findOrCreate(contactdata, data, companydata);
      if (deal.status === 'Deal won') { //dan moeten we een draft submitten

      }
    }
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

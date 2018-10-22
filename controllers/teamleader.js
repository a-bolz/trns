const express = require('express')
const router = express.Router()
const axios = require('axios')
const url = require('url')
const mongoose = require('mongoose')
const db = mongoose.connection
const Token = require('../db/models/Token')
const Deal = require('../db/models/Deal')

router.post('/deal_update', (req, res) => {
  const token = Token.findOne().sort({ created_at: -1 })
  .then((data) => {
    return axios({
      method: 'post',
      url: 'https://app.teamleader.eu/oauth2/access_token',
      headers: {'content-type': 'application/json'},
      data: {
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        refresh_token: data.refresh_token,
        grant_type: 'refresh_token'
      }
    })
  })
  .then((response) => {
    console.log('response');
    return Token.create(response.data)
  })
  .then((token) => {
    console.log('getting deals info', req.body.subject.id)
    return axios({
      method: 'get',
      url: 'https://api.teamleader.eu/deals.info',
      headers: {
        'content-type': 'application/json',
        'Authorization': `Bearer ${token.access_token}`,
      },
      data: {
        id: req.body.subject.id
      }
    })
  }).then((response) => {
    let gegevens = response.data.data
    return Deal.create({ tl_data: gegevens })
  })
  .then((deal) => console.log(deal))
  .catch((err) => {
    console.log(err)
  })
})


router.get('/list_deal_updates', (req, res) => {
  Deal.find({}).then((data) => {
    res.send(data)
  })
})


router.get('/set_webhook', (req, res) => {
  Token.findOne().sort({ created_at: -1 })
  .then((data) => {
    return axios({
      method: 'post',
      url: 'https://app.teamleader.eu/oauth2/access_token',
      headers: {'content-type': 'application/json'},
      data: {
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        refresh_token: data.refresh_token,
        grant_type: 'refresh_token'
      }
    })
  })
  .then((response) => {
    Token.create(response.data, (err, instance) => {
      if (err) return handleError(err)
    })

    return axios({
      method: 'post',
      url: 'https://api.teamleader.eu/webhooks.register',
      headers: {
        'content-type': 'application/json',
        'Authorization': `Bearer ${response.data.access_token}`,
      },
      data: {
        types: [
          "deal.moved",
        ],
        url: 'http://ee9ec5fd.ngrok.io/teamleader/deal_update'
      }
    })
  })
  .then((response) => {
    res.redirect('/teamleader/list_webhooks')
  })
  .catch((error) => {
    console.log(error)
  })
})

router.get('/list_webhooks', (req, res) => {
  Token.findOne().sort({ created_at: -1 })
  .then((data) => {
    return axios({
      method: 'post',
      url: 'https://app.teamleader.eu/oauth2/access_token',
      headers: {'content-type': 'application/json'},
      data: {
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        refresh_token: data.refresh_token,
        grant_type: 'refresh_token'
      }
    })
  })
  .then((response) => {
    Token.create( response.data )

    return axios({
      method: 'get',
      url: 'https://api.teamleader.eu/webhooks.list',
      headers: {
        'content-type': 'application/json',
        'Authorization': `Bearer ${response.data.access_token}`,
      },
    })
  })
  .then((response) => {
    res.send(response.data)
  })
  .catch((error) => {
    console.log(error)
  })
})

module.exports = router

//router.get('/', (req, res) => {
//  res.redirect(url.format({
//    pathname: "https://app.teamleader.eu/oauth2/authorize",
//    query: {
//      client_id: process.env.CLIENT_ID,
//      response_type: 'code',
//      redirect_uri: process.env.REDIRECT_URI || 'http://localhost:5000/auth/callback',
//    }
//  }));
//})

//Webhook Post Data
//{
//  type: 'deal.moved',
//  subject: {
//    type: 'deal', 
//    id: '60592a1b-8c7d-017e-a161-feaee35686f7' 
//  },
//  account: {
//    type: 'account', 
//    id: '0831327a-9e1a-0e3c-a85f-f3b3b911d0e8' 
//  }
//}

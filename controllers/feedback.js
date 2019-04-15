const express = require('express')
const router = express.Router()
const url = require('url')
const Deal = require('../models/deal');
const User = require('../models/user');
const Base64 = require('js-base64').Base64;
const passport = require('../passport');
const ejs = require('ejs');

router.get('/', async (req, res) => {
  const id = Base64.decode(req.query.id);
  if (req.query.cijfer) {
    try {
      console.log('posted feedback');
      await Deal.updateOne(
        { deal_id: req.query.deal_id },
        { $set: { feedback: req.query.feedback, rating: req.query.rating }}
      );
      res.render('feedback/thankyou');
    } catch(error) {
      console.log(error);
    }
  } else {
    try {
      console.log(ejs.render('<%= people.join("-")%>', {people: ['andreas','milan']}));
      console.log('no feedback yet, rendering form');
      console.log(id);
      const deal = await Deal.find({ deal_id: id });
      console.log(deal);
      if (false) {
        res.render('feedback/sorry');
      } else if (true) {
        res.render('feedback/thankyou');
      } else {
        //res.render('feedback', deal);
        res.render('feedback/index', {title: 'test', message: 'testmessage', id: id});
      }
    } catch(error) {
      console.log(error);
    }
  }
});

router.get('/overzicht', 
  require('connect-ensure-login').ensureLoggedIn(),
  async (req, res)=> {
    const deals = await Deal.find({});
    res.render('feedback/overzicht', {deals: deals});
  }
);

router.get('/reviewverzoek', async (req, res) => {
  res.render('feedback/thankyou');
});



module.exports = router;

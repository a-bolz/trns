const express = require('express')
const router = express.Router()
const url = require('url')
const Deal = require('../models/deal');
const Base64 = require('js-base64').Base64;

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
      console.log('no feedback yet, rendering form');
      console.log(id);
      const deal = await Deal.find({ deal_id: id });
      console.log(deal);
      if (!deal) {
        res.render('feedback/sorry');
      } else if (deal && deal.rating) {
        res.render('feedback/thankyou');
      } else {
        //res.render('feedback', deal);
        res.render('feedback/index', {title: 'test', message: 'testmessage', id: id});
      }
    } catch(error) {
      console.log(error);
    }
  }
})

module.exports = router;

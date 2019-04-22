const express = require('express')
const router = express.Router()
const url = require('url')
const Deal = require('../models/deal');
const User = require('../models/user');
const Base64 = require('js-base64').Base64;
const passport = require('../passport');
const ejs = require('ejs');

router.get('/submit', async (req, res) => {
  try {
    const { id, cijfer } = req.query;
    const deal = await Deal.findByDealId(id, function(err, res) {
      if (err) throw(err);
      return res;
    });
    if (!!cijfer && !!deal) {
      deal.rating = cijfer;
      await deal.save();
      if (cijfer < 8) {
        console.log('render written feedback');
        res.render('feedback/written_feedback', {id, cijfer}); //we want written feedback;
      } else {
        console.log('render thankyou');
        res.render('feedback/thankyou'); //we say thankyou
      }
    } else {
      console.log('no rating/deal. render sorry');
      res.render('feedback/sorry'); //geen cijfer of deal, er ging iets mis :/
    }
  } catch(error) {
    console.log('error in submit', error);
    res.render('feedback/sorry');
  }
});

router.post('/submit', async (req, res) => {
  try {
    const {id, cijfer, feedback} = req.body;
    const deal = await Deal.findByDealId(id, function(err, res) {
      if (err) throw(err);
      return res;
    });
    deal.feedback = feedback;
    await deal.save();
    res.render('feedback/thankyou');
  } catch (error) {
    console.log(error);
    res.render('feedback/thankyou');
  }
});

//router.get('/overzicht', 
//  async (req, res)=> {
//    res.render('feedback/overzicht', {deals: deals});
//  }
//);

router.get('/overzicht', async (req, res, next) => {
  require('connect-ensure-login').ensureLoggedIn();
  const deals = await Deal.find({}).lean();
  const data = {
    deals: deals,
  }


  req.vueOptions = {
    head: {
      title: 'Page Title',
      metas: [
        { property: 'og:title', content: 'Page Title'},
      ]
    }
  }
  res.renderVue('main.vue', data, req.vueOptions);
})


router.get('/reviewverzoek', async (req, res) => {
  res.render('feedback/thankyou');
});



module.exports = router;

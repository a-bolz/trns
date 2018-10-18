require User from './user'

const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const bodyParser = require('body-parser');
const passport = require('passport');
const OAuth2Strategy = require('passport-oauth2');



require('dotenv').config()

passport.use(new OAuth2Strategy({
  authorizationURL: 'https://app.teamleader.eu/oauth2/authorize',
  tokenURL: 'https://app.teamleader.eu/oauth2/access_token',
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: "http://localhost:5000/auth/example/callback",
},
function(accessToken, refreshToken, profile, cb) {
  console.log(accessToken, '\n\n', refreshToken, '\n\n', profile, '\n\n', cb)
//  User.findOrCreate({ exampleId: profile.id }, function (err, user) {
//    return cb(err, user);
//  });
}
));


express()
  .use(express.static(path.join(__dirname, 'public')))
  .use(bodyParser.json())
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/auth/example', passport.authenticate('oauth2'))
  .get(
    '/auth/example/callback', 
    passport.authenticate('oauth2', { failureRedirect: '/login' }),
    function(req, res) {
      // Successful authentication, redirect home.
      res.redirect('/');
   })
  .get('/', (req, res) => res.render('pages/index'))
  .get('/authenticate', (req, res) => res.render('pages/authenticate'))
  .post('/onzeapi', (req, res) => {
    console.log(req.body)
    res.send('thanks')
  })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))


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


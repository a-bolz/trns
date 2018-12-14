const dotenv = require('dotenv').config();
const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const bodyParser = require('body-parser');
const passport = require('passport');
const OAuth2Strategy = require('passport-oauth2');
const calls = require('./services/calls')
const url = require('url')
const axios = require('axios')
const auth = require('./controllers/authentication')
const teamleader = require('./controllers/teamleader')

const app = express()

app.listen(process.env.PORT || 5000);
app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.json())
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use('/auth', auth)
app.use('/teamleader', teamleader)

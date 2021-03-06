const dotenv = require('dotenv').config();
const fs = require('fs')
const readline = require('readline');
const {google} = require('googleapis');
const SCOPES = ['https://www.googleapis.com/auth/gmail.modify'];
const GMAIL_TOKEN_PATH = 'gmail_token.json';
const GMAIL_CREDENTIALS_PATH = 'credentials.json';
const EMAIL_SENDER = process.env.EMAIL_SENDER;
const TL_TOKEN_PATH = 'tl_token.json'
const BASE_URL = process.env.BASE_URL;
const client_id = process.env.TL_CLIENT_ID;
const axios = require('axios');
const promisify = require('promisify');
const util = require('util');
const mimemessage = require('mimemessage');
const Base64 = require('js-base64').Base64;
const User = require('../models/user.js');
const ejs = require('ejs');
const debug = (data, flag="DEBUG") => console.log(
  `${flag}=========================================\n\n\n\n\n`,
  data,
  `\n\n\n\n\n=========================================${flag}`
);

const readFile = util.promisify(fs.readFile);

const scopes = [
  'https://www.googleapis.com/auth/gmail.modify'
]


const urls = {
  list_webhooks: 'https://api.teamleader.eu/webhooks.list',
  deals_info: 'https://api.teamleader.eu/deals.info',
  contacts_list: 'https://api.teamleader.eu/contacts.list',
  webhooks_register: 'https://api.teamleader.eu/webhooks.register',
  contacts_info: 'https://api.teamleader.eu/contacts.info',
  companies_info: 'https://api.teamleader.eu/companies.info',
}

const getEmail = ({contactEmail, contactFirstName, dealId}) => {
  console.log('email params',contactEmail, contactFirstName,dealId);
  const msg = mimemessage.factory({
    contentType: 'text/html;charset=utf-8',

    body: `Hoi ${contactFirstName},\n\n<p>Mijn naam is Zaza en ik ben marketeer bij Textwerk. Kortgeleden hebben wij jouw vertaalopdracht opgeleverd en we zijn benieuwd hoe tevreden je daarover bent.</p>
    <p>Zou jij je mening willen geven en aan kunnen geven of je ons zou aanbevelen?</p>
    <p>Hoe waarschijnlijk is het dat je Textwerk op basis van dit project zou aanbevelen aan een relatie of collega?</p>
    <p>${
        [1,2,3,4,5,6,7,8,9,10]
          .map(d => {
            return `<a href="${process.env.BASE_URL}feedback/submit?id=${dealId}&rating=${d}">${d}</a>`
          })
          .join(' - ')
       }</p>
      <p>Ik ben benieuwd naar je feedback!</p>
    `
  })
  msg.header('from', 'andreasbolz@gmail.com');
  msg.header('to', contactEmail);
  msg.header('subject', 'please rate us');
  return Base64.encode(msg.toString()).replace(/\//g, "_").replace(/\+/g, "-");
}

function draftMessage(params) {

  const message = {
    to: {
      name: "Google Scripts",
      email: "andreasbolz@gmail.com"
    },
    from: {
      name: "Andreas",
      email: "andreasbolz@gmail.com"
    },
    body: {
      text: "Mr hänn is schon lang nümme g'she.",
      html: "Mr hänn is schon <b>lang nümme</b> g'she."
    },
    subject: "ctrlq, tech à la carte",
  };

  return createMimeMessage_(message);
}

function encode_(subject) {
  var enc_subject = Base64.encode(subject);
  return '=?utf-8?B?' + enc_subject + '?=';
}

function createMimeMessage_(msg) {
  console.log(msg);

  var nl = "\n";
  var boundary = "__ctrlq_dot_org__";

  var mimeBody = [

    "MIME-Version: 1.0",
    "To: "      + msg.to.name + "<" + msg.to.email + ">",
    "From: "    + msg.from.name + "<" + msg.from.email + ">",
    "Subject: " + msg.subject, // takes care of accented characters

    "Content-Type: multipart/alternative; boundary=" + boundary + nl,
    "--" + boundary,

    "Content-Type: text/plain; charset=UTF-8",
    "Content-Transfer-Encoding: base64" + nl,
    msg.body.text + nl,
    "--" + boundary,

    "Content-Type: text/html; charset=UTF-8",
    "Content-Transfer-Encoding: base64" + nl,
    msg.body.html + nl

  ];


  mimeBody.push("--" + boundary + "--");

  console.log('after mime',mimeBody.join(nl));


  return mimeBody.join(nl);

}

module.exports = {
  tl_auth: {
    setToken: async (code) => {
      const response = await axios({
        method: 'post',
        url: process.env.TL_AUTH_URL,
        headers: {'content-type': 'application/json'},
        data: {
          client_id: process.env.TL_CLIENT_ID,
          client_secret: process.env.TL_CLIENT_SECRET,
          redirect_uri: process.env.TL_REDIRECT_URI || 'http://localhost:5000/auth',
          code: code,
          grant_type: 'authorization_code'
        }
      })
      const token_data = JSON.stringify(response.data);
      await fs.writeFile(TL_TOKEN_PATH, token_data, (err) => {
        if (err) throw err;
        console.log('The file has been saved');
      });
      return Promise.resolve(response.data);
    },
    refreshToken: async () => {
      try {
        const file = await readFile(TL_TOKEN_PATH, 'utf8');
        const parsedFile = JSON.parse(file);
        const response = await axios({
          method: 'post',
          url: process.env.TL_ACCESS_TOKEN_URL,
          headers: {'content-type': 'application/json'},
          data: {
            client_id: process.env.TL_CLIENT_ID,
            client_secret: process.env.TL_CLIENT_SECRET,
            refresh_token: parsedFile.refresh_token,
            grant_type: 'refresh_token'
          }
        })
        await fs.writeFile(TL_TOKEN_PATH, JSON.stringify(response.data), (err) => {
          if (err) throw err;
        })
        return Promise.resolve(response.data.access_token)
      } catch (err) {
        return Promise.resolve(err)
      }
    },
  },
    teamleader: {
      getDealsInfo: async (access_token, id) => {
        return axios({
          method: 'get',
          url: urls.deals_info,
          headers: {
            'content-type': 'application/json',
            'Authorization': `Bearer ${access_token}`,
          },
          data: {
            id: id
          }
        })
      },
      getContactInfo: async (access_token, id) => {
        return await axios({
          method: 'get',
          url: urls.contacts_info,
          headers: {
            'content-type': 'application/json',
            'Authorization': `Bearer ${access_token}`,
          },
          data: {
            id: id
          }
        })
      },
      getCompanyInfo: async (access_token, id) => {
        return await axios({
          method: 'get',
          url: urls.companies_info,
          headers: {
            'content-type': 'application/json',
            'Authorization': `Bearer ${access_token}`,
          },
          data: {
            id: id
          }
        })
      },
      getContactsList: async (access_token, filter) => {
        return axios({
          method: 'get',
          url: urls.contacts_list,
          headers: {
            'content-type': 'application/json',
            'Authorization': `Bearer ${access_token}`,
          },
          data: {
            filter: filter
          }
        })
      },
      registerWebhook: async(access_token) => {
        return axios({
          method: 'post',
          url: urls.webhooks_register,
          headers: {
            'content-type': 'application/json',
            'Authorization': `Bearer ${access_token}`,
          },
          data: {
            types: [
              "deal.moved",
            ],
            url: `${process.env.TUNNEL || process.env.BASE_URL}teamleader/deal_update`,
          }
        })
      },
      getWebhooks: async(access_token) => {
        return axios({
          method: 'get',
          url: urls.list_webhooks,
          headers: {
            'content-type': 'application/json',
            'Authorization': `Bearer ${access_token}`,
          },
        })
      }
    },
    gmail_auth: {
      setToken: async (code) => {
        try {
          const cred_file = await readFile(GMAIL_CREDENTIALS_PATH, 'utf8');
          const gmail_credentials = JSON.parse(cred_file).installed;
          const oauth2Client = new google.auth.OAuth2(
            gmail_credentials.client_id,
            gmail_credentials.client_secret,
            process.env.GMAIL_REDIRECT_URI 
          )
          const { tokens } = await oauth2Client.getToken(code);
          await fs.writeFile(GMAIL_TOKEN_PATH, JSON.stringify(tokens), (err) => {
            if (err) throw err;
            console.log('GMAIL TOKEN saved');
          });
          return Promise.resolve(tokens);
        } catch(err) {
          return Promise.reject(err);
        }
      },
      refreshToken: async () => {
        try {
          const token_file = await readFile(GMAIL_TOKEN_PATH, 'utf8');
          const credentials_file = await readFile(GMAIL_CREDENTIALS_PATH, 'utf8');
          const tokens = JSON.parse(token_file);
          const credentials = JSON.parse(credentials_file).installed;
          const auth = new google.auth.OAuth2( 
            credentials.client_id,
            credentials.client_secret,
            process.env.GMAIL_REDIRECT_URI
          )
          auth.setCredentials(tokens);
          const res = await auth.refreshAccessToken();
          const newCredentials = res.credentials
          await fs.writeFile(GMAIL_TOKEN_PATH, JSON.stringify(newCredentials), (err) => {
            if (err) throw err;
            console.log('GMAIL TOKEN saved');
          });
          return Promise.resolve(newCredentials.access_token);
        } catch (err) {
          console.log(err)
          return Promise.reject(err)
        }
      },

    },
    gmail: {
      getList: async(access_token) => {
        return axios({
          method: 'get',
          url: 'https://www.googleapis.com/gmail/v1/users/me/labels',
          headers: {
            'Authorization': `Bearer ${access_token}`,
          },
        })
      },
      submitDraft: async(token, deal) => {
        try {
          const email = getEmail(deal);
          return axios({
            method: 'post',
            url: 'https://www.googleapis.com/gmail/v1/users/me/drafts',
            headers: {
              'content-type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            data: {
              "message": {
                "raw": email,
              }
            },
          })
        } catch(error) {
          console.log(error)
        }
      }
    },
    sheets: {
      getBlob: async(access_token) => {
        var file_id = '18dpJ6tn0lZMD9otnq5TrDU_NjYeX9lTHiUIMIQOjRQo';
        return axios({
          method: 'get',
          url: `https://www.googleapis.com/v4/spreadsheets/${file_id}/values/Sheet1!1:2`,
          headers: {
            'content-type': 'application/json',
            'Authorization': `Bearer ${access_token}`,
          }
        })
      },
    },
  }

const fs = require('fs')
const readline = require('readline');
const {google} = require('googleapis');
const SCOPES = ['https://www.googleapis.com/auth/gmail.modify'];
const GMAIL_TOKEN_PATH = 'gmail_token.json';
const GMAIL_CREDENTIALS_PATH = 'credentials.json';
const TL_TOKEN_PATH = 'tl_token.json'
const client_id = process.env.TL_CLIENT_ID;
const client_secret = process.env_TL_CLIENT_SECRET;
const axios = require('axios');
const promisify = require('promisify');
const util = require('util');
const mimemessage = require('mimemessage');
const Base64 = require('js-base64').Base64;

const readFile = util.promisify(fs.readFile);

const scopes = [
  'https://www.googleapis.com/auth/gmail.modify'
]

const urls = {
  list_webhooks: 'https://api.teamleader.eu/webhooks.list',
  deals_info: 'https://api.teamleader.eu/deals.info',
  contacts_list: 'https://api.teamleader.eu/contacts.list',
  webhooks_register: 'https://api.teamleader.eu/webhooks.register'
}

const getEmail = () => {
  const msg = mimemessage.factory({
    contentType: 'text/html;charset=utf-8',
    body: [`
      Beste jan,
      Bedankt voor je deal met lbaat\nGr
    `]
  })
  msg.header('from', 'andreasbolz@gmail.com');
  msg.header('to', 'andreasbolz@gmail.com');
  msg.header('subject', 'please rate us');
  return Base64.encode(msg.toString());
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
      registerWebhook: async(access_token, tunnel) => {
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
            url: `${process.env.TUNNEL}teamleader/deal_update`,
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
      submitDraft: async(token, message_params) => {
        try {
          const email = getEmail();
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
    }
  }

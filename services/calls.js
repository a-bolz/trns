const fs = require('fs')
const TL_TOKEN_PATH = 'tl_token.json'
const client_id = process.env.TL_CLIENT_ID;
const client_secret = process.env_TL_CLIENT_SECRET;
const axios = require('axios');
const promisify = require('promisify');
const util = require('util');

const readFile = util.promisify(fs.readFile);

const urls = {
  list_webhooks: 'https://api.teamleader.eu/webhooks.list',
  deals_info: 'https://api.teamleader.eu/deals.info',
  contacts_list: 'https://api.teamleader.eu/contacts.list',
  webhooks_register: 'https://api.teamleader.eu/webhooks.register'
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
      const response = await axios({
        method: 'post',
        url: process.env.GMAIL_AUTH_URL,
        headers: {'content-type': 'application/json'},
        data: {
          client_id: process.env.TL_CLIENT_ID,
          client_secret: process.env.TL_CLIENT_SECRET,
          redirect_uri: process.env.TL_REDIRECT_URI || 'http://localhost:5000/auth/mail',
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
          url: 'https://app.teamleader.eu/oauth2/access_token',
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
    gmail: {

    }
  }

let {gmail, gmail_auth} = require('./services/calls.js');

const sendmail = async () => {
  let token = await gmail_auth.refreshToken();
  await gmail.submitDraft(token);
}

sendmail().then(res => console.log('SUCCES', res)).catch(e => console.log("ERROR", e));

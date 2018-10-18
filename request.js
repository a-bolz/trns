var request = require("request");

var options = { method: 'POST',
  url: 'https://app.teamleader.eu/oauth2/access_token',
  headers: { 'content-type': 'application/json' },
  body: 
   { grant_type: 'client_credentials',
     client_id: '0aca3ed99ff613f3c1c6b1efcb055812',
     client_secret: '2923ac3b0d8c0c7073cf774ad19024f3',
     audience: 'andreastest' },
  json: true };

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});

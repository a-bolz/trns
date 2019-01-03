function createDraftMessage() {

  var message = {
    to: {
      name: "Google Scripts",
      email: "amit@labnol.org"
    },
    from: {
      name: "Amit Agarwal",
      email: "amit@labnol.org"
    },
    body: {
      text: "Mr hänn is schon lang nümme g'she.",
      html: "Mr hänn is schon <b>lang nümme</b> g'she."
    },
    subject: "ctrlq, tech à la carte",
    files: getAttachments_(attachments)
  };

  // Compose Gmail message and send immediately
  callGmailAPI_(message);

}


function callGmailAPI_(message) {

  var payload = createMimeMessage_(message);

  var response = UrlFetchApp.fetch(
    "https://www.googleapis.com/upload/gmail/v1/users/me/drafts?uploadType=media", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + ScriptApp.getOAuthToken(),
        "Content-Type": "message/rfc822",
      },
      muteHttpExceptions: true,
      payload: payload
    });

  Logger.log(response.getResponseCode());
  Logger.log(response.getContentText());

}

// UTF-8 characters in names and subject
function encode_(subject) {
  var enc_subject = Utilities.base64Encode(subject, Utilities.Charset.UTF_8);
  return '=?utf-8?B?' + enc_subject + '?=';
}

// Create a MIME message that complies with RFC 2822
function createMimeMessage_(msg) {

  var nl = "\n";
  var boundary = "__ctrlq_dot_org__";

  var mimeBody = [

    "MIME-Version: 1.0",
    "To: "      + encode_(msg.to.name) + "<" + msg.to.email + ">",
    "From: "    + encode_(msg.from.name) + "<" + msg.from.email + ">",
    "Subject: " + encode_(msg.subject), // takes care of accented characters

    "Content-Type: multipart/alternative; boundary=" + boundary + nl,
    "--" + boundary,

    "Content-Type: text/plain; charset=UTF-8",
    "Content-Transfer-Encoding: base64" + nl,
    Utilities.base64Encode(msg.body.text, Utilities.Charset.UTF_8) + nl,
    "--" + boundary,

    "Content-Type: text/html; charset=UTF-8",
    "Content-Transfer-Encoding: base64" + nl,
    Utilities.base64Encode(msg.body.html, Utilities.Charset.UTF_8) + nl

  ];

  mimeBody.push("--" + boundary + "--");

  return mimeBody.join(nl);

}

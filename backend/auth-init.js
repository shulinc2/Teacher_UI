// auth-init.js
const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');

const SCOPES = ['https://www.googleapis.com/auth/drive.readonly'];
const TOKEN_PATH = 'token.json';

fs.readFile('client_secrets.json', (err, content) => {
  if (err) return console.error('❌ Error loading client secret file:', err);
  authorize(JSON.parse(content), saveToken);
});

function authorize(credentials, callback) {
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });

  console.log('🌐 Open the following URL in your browser:');
  console.log(authUrl);

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  rl.question('Paste the authorization code here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('❌ Error retrieving token', err);
      oAuth2Client.setCredentials(token);
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('✅ Token stored to', TOKEN_PATH);
      });
    });
  });
}

function saveToken(auth) {
  console.log('✅ Auth successful');
}

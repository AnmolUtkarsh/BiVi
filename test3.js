// Import Express.js
require('dotenv').config()
const express = require('express');
const { incom_mess, wa_reply } = require('./cont.js')

// Create an Express app
const app = express();


app.use(express.json());


const port = process.env.PORT || 3000;
const verifyToken = process.env.verify_token;



app.get('/webhook', (req, res) => {
  const { 'hub.mode': mode, 'hub.challenge': challenge, 'hub.verify_token': token } = req.query;

  if (mode === 'subscribe' && token === verifyToken) {
    console.log('WEBHOOK VERIFIED');
    res.status(200).send(challenge);
  } else {
    res.status(403).end();
  }
});


app.post('/webhook', async (req, res) => {


  const value = req.body.entry?.[0]?.changes?.[0]?.value;

 const mess = value.messages?.[0]?.text?.body;

  const ph_number = value.contacts?.[0]?.wa_id;
  const uid = value.contacts?.[0]?.user_id;
  const uname = value.contacts?.[0]?.profile?.name;
  const messageId = value.messages?.[0]?.id;

  if (!value || !value.messages) {
    if (!value.messages) {
      return res.sendStatus(200);}
    }
    // if (!req) return res.sendStatus(200);

    // const value = req.body.entry[0].changes[0].value;

    // const mess = value.messages[0].text.body;

    // const ph_number = value.contacts[0].wa_id;
    // const uid = value.contacts[0].user_id;
    // const uname = value.contacts[0].profile.name;
    // const messageId = value.messages?.[0].id






    // const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
    // console.log(`\n\nWebhook received ${timestamp}\n`);
    // console.log(JSON.stringify(req.body,null, 2));
    res.sendStatus(200)
    await incom_mess(req, res)
    await wa_reply(ph_number, "Hello How are You?")
    // res.status(200).end();
    // res.sendStatus(200)
  });


app.listen(port, () => {
  console.log(`\nListening on port ${port}\n`);
});
process.on("SIGINT", () => {
  console.log("Closing Server");
  process.exit(0)
})
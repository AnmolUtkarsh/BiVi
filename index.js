const { Client, Events, GatewayIntentBits } = require('discord.js')
require("dotenv").config()
const { incom_mess } = require('./cont.js')

const port = process.env.PORT || 3000;
const verifyToken = process.env.verify_token;
const {
  fetching } = require('./controller.js')
const { main } = require('./main.js')
const express = require('express');
const { errmsg } = require('./messages');



const client = new Client({
  intents: [GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.MessageContent,
  ]
});
try {
  client.once(Events.ClientReady, async (readyClient) => {
    console.log("Turning ON Server and Turning on BiVi Listener!")
    await console.log(`Server and Listener is Ready! 
			Logining in as ${readyClient.user.tag}`);
    console.log(`Successfully Logged in as: ${readyClient.user.tag}`)
  });
}
catch (error) {
  console.log("Error Starting the Server!")
}


const app = express();


app.use(express.json());


app.get('/webhook', (mess, res) => {
  const { 'hub.mode': mode, 'hub.challenge': challenge, 'hub.verify_token': token } = mess.query;

  if (mode === 'subscribe' && token === verifyToken) {
    console.log('WEBHOOK VERIFIED');
    res.status(200).send(challenge);
  } else {
    res.status(403).end();
  }
});


app.post('/webhook', async (req, res) => {

  const event = req.body;
  try {
    if (event?.chat) {
      let eventType = "UNKNOWN";

      if (event.chat?.messagePayload?.message) {
        eventType = "MESSAGE";
      }
      else if (event?.chat?.addedToSpacePayload) {
        eventType = "ADDED_TO_SPACE";
      }
      else if (event?.chat?.removedFromSpacePayload) {
        eventType = "REMOVED_FROM_SPACE";
      }

      // console.log("Event received");
      console.log(`Google Chat event received: ${eventType}`);
      try {
        if (eventType === "MESSAGE") {
          const response = await main(req, client);

          // console.log("FINAL RESPONSE:", JSON.stringify(response));

          return res.status(200).json(response);
        }
      } catch (error) {
        console.log("Webhook error in Google Chats:", error);
        res.sendStatus(200);
      }
    }
    // const message = event.chat?.messagePayload?.message;
    else if (event?.entry?.[0]?.changes?.[0]?.value?.messages?.[0]) {
      console.log("WhatsApp message event received");
      res.sendStatus(200);
      try {
        await incom_mess(req, res);
        await main(req, client);
      } catch (err) {
        console.error("Webhook Error in WhatsApp:", err);
      }
    }

    else {
      console.log("Unrecognized webhook structure received.");
      res.status(403).end();
    }

  } catch (globalErr) {
    console.error("Critical webhook router failure:", globalErr);
    res.status(403).end();
  }
  // if (!req.body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0] && !req.body?.chat?.messagePayload?.message) {
  //   return;
  // }
});


app.listen(port || 3000, () => {
  console.log(`\nListening on port ${port || 3000}\n`);
});


client.on(Events.MessageCreate, async (mess) => {
  try {
    await main(mess, client)
  } catch (err) {
    console.log("Discord message processing error:", err)
  }
})


client.login(process.env.discord_token).catch(console.log("Error in Logining in Discord!"));

process.on("SIGINT", () => {
  console.log("Closing Server")
  console.log("Exiting")
  client.destroy()
  process.exit(0);
})

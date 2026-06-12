const { Client, Events, GatewayIntentBits } = require('discord.js')
require("dotenv").config()
const { incom_mess, wa_reply } = require('./cont.js')

const port = process.env.PORT || 3000;
const verifyToken = process.env.verify_token;
const { 
fetching } = require('./controller.js')
const { main } = require('./main.js')
const express = require('express');



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
  res.sendStatus(200);

  const message = req.body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
  if (!message) {
    return;
  }

  try {
    await incom_mess(req, res);
    await main(req, client);
  } catch (err) {
    console.log("Webhook error:", err);
  }
});


app.listen(port, () => {
  console.log(`\nListening on port ${port}\n`);
});


client.on(Events.MessageCreate, async (mess) => {
	await main(mess, client)
})


client.login(process.env.discord_token);

process.on("SIGINT", () => {
	console.log("Closing Server")
	console.log("Exiting")
	client.destroy()
	process.exit(0);
})

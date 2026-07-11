const express = require('express')
require('dotenv').config()

const app = express()
app.use(express.json())

app.post("/webhook", (req,res)=>{
    console.log("WhatsApp message event received");
      res.sendStatus(200);
      try {

        console.log(req.body,null,2)
        // await incom_mess(req, res);
        // await main(req, client);
      } catch (err) {
        console.error("Webhook Error in WhatsApp:", err);
      }
}).listen(3000, ()=>{
    console.log("Listening on the PORT 3000!")
})
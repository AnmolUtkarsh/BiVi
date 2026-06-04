// const {commands} = require('./messages.js')
// const {filt} = require('./controller.js')
// const http = require('http')
// const server = http.createServer((req, res)=>{
//     res.end("Hello World");
// }).listen(3000,()=>{
//     console.log("Server Starting at PORT 3000!")
// })
// console.log(commands)

// const {Client, Events, GatewayIntentBits} = require('discord.js')

// console.log(Events)

// const { Client, Events, GatewayIntentBits } = require('discord.js')

// const a = ["Hello"]
// console.log(a.includes("hello"))

// const a = "Yes:100";
// const answer = (filt(a)).split(":");
// console.log(answer)


const a = "Hello World";
console.log(a.startsWith())





















const {BiVi_reply} = require('./api.js')
console.log(BiVi_reply("Hello World"))


process.on("SIGINT", ()=>{
	console.log("Exiting")
	process.exit(0);
})
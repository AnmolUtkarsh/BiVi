// const { default: Groq } = require("groq-sdk")
const version = "BiVi v1.6.2 Unstable"
const sessions = new Map();
const { Client, Events, GatewayIntentBits } = require('discord.js')
const groq = require('groq-sdk')
require("dotenv").config()
const { unfinished, command, hello, userInfo, serverInfo, botInfo, commands_arr } = require('./messages.js')
const { indi_reply, filt, reply, del, clear, checker, fetching } = require('./controller.js')
const os = require("os");
const { BiVi_reply, BiVi, BiVi_Force_Reply } = require('./api.js')
const { Error50035, errorHandlers } = require('./unerror.js')
const { storyplay, stories, store } = require('./story.js')

fetching()

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

client.on(Events.MessageCreate, async (mess) => {
	const start = performance.now()
	if (mess.author.bot) return;
	const session = sessions.get(mess.author.id);
	const value = filt(mess.content)
	if (session?.type === "Playing_Story") {
		if (value !== "stop" && value !== "pause" && value !== "play" && value !== "resume" && value !== "restart") { return; }
		if (session.type === "Playing_Story" && (value === "play" || value === "resume" || value === "restart")) {
			await indi_reply(mess, "Already Running");
			return;
		}
		if (session?.type == "Playing_Story" && (value == "pause")) {
			session.set(mess.author.id, { type: "Paused" });
			await indi_reply(mess, "⏸️ Story Paused.");
			return;
		}
		if (session?.type == "Playing_Story" || session?.type == "Paused" && (value == "stop")) {
			session.set(mess.author.id, { type: "Stopped" });
			await indi_reply(mess, "🛑 Story Stoped!");
			return;
		}
	}
	if (session?.type === "clear" || session?.type === "cls") {
		await clear(mess, session, sessions);
		return;
	}
	// if (session?.type === "story" || session?.type === "stories") {
	// 	await Story_Output(mess);
	// 	return;
	// }


	const name = mess.author.globalName
	function end() {
		let endit = performance.now()
		return `\n\n~${(endit - start).toFixed(2)}ms`;
	}
	console.log("Message by:", name)
	console.log("Message =", value)
	if (command[value] || commands_arr.includes(value) || value.includes(String(Object.keys(store)))) {
		if (value == "hello" || value == "Hi") {
			reply(mess, hello(name, mess.author.username) + end())
		}
		else if (value == "userinfo") {
			reply(mess, userInfo(mess) + end())
		}
		else if (value == "serverstatus" || value == "server status" || value == "serverinfo") {
			reply(mess, serverInfo() + end())
		}
		else if (value == "botstatus" || value == "bot status" || value == "botinfo") {
			reply(mess, botInfo() + end())
		}
		else if (value == "delete" || value == "delete this") {
			del(mess)
		}
		else if (value === "server:shutdown" && mess.author.id === process.env.admin_id) {
			await reply(mess, "Shutting down...");
			client.destroy();
			process.exit(0);
		}
		else if (value == "story" || value == "stories") {

			const storyKeys = Object.keys(stories);
			let j = storyKeys
				.map(key => key.replace(/^\[\d+\]\s*/, ""))
				.join('\n');
			const b = await reply(mess, `Currently these Stories are Available:

***${j}***

Note: This is a Featured Section of BiVi, introduced in BiVi's Unstable v6.0.1`);

			await b.reply(`Do You Want to Listen to any Story in the given List of Stories?
Expected Input [Yes/No/Exit]`)
			const filter = m => m.author.id === mess.author.id;

			try {
				const yesNoCollected = await mess.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] });
				const yesNoResponse1 = filt(yesNoCollected.first().content);
				var hmm = parseInt(yesNoCollected.first().content.split(":")[0]);
				if (filt(yesNoCollected.first().content.split(":")[1] === "detail" || filt(yesNoCollected.first().content.split(":")[1] === "details")) && ((!isNaN(hmm)) && hmm <= Object.keys(store).length && hmm >= Object.keys(store).length)) {
					var hehe = store[1][0];
					indi_reply(mess, `Story:
${hehe[0][0]}\n${hehe[0][1]}\n${hehe[0][2]}\n${hehe[0][3]} , ${hehe[0][4]}\n${hehe[0][5]}\n
Maximum Time Duration: ${15 / 1000}s OR ${((15 / 1000) / 60)}mins
Minimum Time Duration: ${60 / 1000}s OR ${((60 / 1000) / 60)}mins

Note: The Genre is : ${(hehe[0][2]).split(":")[1]}`)
				}
				if (yesNoResponse1 == "no" || yesNoResponse1 == "exit") {
					await reply(mess, `Ok, Reverting Back...!`);
					sessions.delete(mess.author.id);
					return;
				}

				if (yesNoResponse1 !== 'yes' && (yesNoResponse1 !== 'no' || yesNoResponse1 !== 'exit')) {
					await reply(mess, `Invalid Input...💔,
Reverting Back....!1`)
					sessions.delete(mess.author.id);
					return;
					// client.off(Events.MessageCreate, newmess)

				}


				if (yesNoResponse1 == "yes") {
					const a = await reply(mess, `Ok, Please Choose the Number of the Story from the Following:\n`)
					await a.reply(await j)

					const numCollected = await mess.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] });

					const storyIndex = await parseInt(numCollected.first().content);

					if (isNaN(Number(storyIndex))) return;
					await reply(mess, `Please Enter the Time Interval for each Story Line Message. (Minimum is **15 Seconds** [Default] and Maximum is **60**.)

Consider this Example: 
If you Enter **\`15\`**, then each New Story Line message will come in Interval of 15 Seconds:
	Story Line 1 (Starting)
	|
	15 Seconds...
	|
	Story Line 2
	|
	15 Seconds...
	|
	Story Line 3 (Ending)
	
	Tip: IF Reading Story in GROUP, MORE Timing is Preferred as it maintains the Thrills`);

					const timeCollected = await mess.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] });
					let timing = await parseInt(timeCollected.first().content);

					if ((timing < 15) && (timing > 60)) {
						await indi_reply(mess, "Error Playing the Story Cause the Time Set is Less than 15 seconds or More than 60 seconds.");
						await indi_reply(mess, `Reverting Back...!`);
						await sessions.delete(mess.author.id);
						return;
					}
					if ((timing >= 15) && (timing <= 60)) {

						if ((store[storyIndex]) === undefined) { return `Sorry can't Process this Request now...💔` }
						else {
							// await sessions.set(mess.author.id, { type: "Playing_Story" });
							await storyplay(mess, store[storyIndex], timing, sessions)
						}
						// await sessions.set(mess.author.id, { type: "none" });
						await sessions.delete(mess.author.id);
						return;
					}
					// client.on(Events.MessageCreate, newmess)
				}

			} catch (error) {
				reply(mess, "Sorry Dear, Request Time Over!\nTimeOut Error in: (" + end())
				return
			}

			// 					await client.on(Events.MessageCreate, newmess)
			// 					const newmess1 = async function (mess2) {
			// 						if (isNaN(mess2.content) == true) {
			// 							if ((mess2.content > 0) && ((mess2.content) <= stories[1].length)) {
			// 								let timing = 0;
			// reply(mess2, );
			// 								const newmess2 = async function (mess3) {
			// 									timing = Number(mess3.content)
			// 								}
			// 								client.on(Events.MessageCreate, newmess2)
			// 								client.off(Events.MessageCreate, newmess1)

			// 								const story_name = await store[mess2]
			// 								await storyplay(mess3, story_name, timing)

			// 								client.off(Events.MessageCreate, newmess2)
			// 							}
			// 							reply(mess2, `Invalid Input...💔,
			// Reverting Back....!`)
			// 						}
			// 						else {
			// 							reply(mess2, `Invalid Input...💔,
			// Reverting Back....!`)
			// 							client.off(Events.MessageCreate, newmess1)
			// 						}
			// 					}
			// 					client.on(Events.MessageCreate, newmess)
		}

		else if (value == 'exit') {
			sessions.delete(mess.author.id);
			return;
		}
		else if ((value.startsWith('force:')) && value.includes(" ")) {
			reply(mess, checker(mess))
		}
		else if (value == 'clear' || value == 'cls') {
			sessions.set(mess.author.id, {
				type: "clear",
				step: "awaiting_confirm"
			});
			await reply(mess, `Do you really want to Clear BiVi Bot Messages? By default it is set to *Last 10* Messages.
Guide:
		You can clear up BiVi Bot Messages upto defined limited, for which you need to write: \`Yes:_Number*_\`
	Example: \`Yes:100\`. This will delete last 100 Messages sent by BiVi
Other Expected Inputs: 
	\`Yes\`-> Deletes last 10 [Default][Excluded], 
	\`Yes:all\`-> Deletes last 100 Messages [Included]`);

		}
		else {
			if (typeof String(command[value] === "function")) {
				const result = await command[value](mess);
				if (result && result.trim() !== "") {
					await reply(mess, result + end());
				}
				else {
					const result = await command[value];
					if (result && result.trim() !== "") {
						await reply(mess, result + end());
					}
				}
			}
		}
	}
	else {
		try {
			await reply(mess, await checker(mess))
		}
		catch (error) {
			try {
				await reply(mess, (`Error \`${error.status}\` with code: \`${error.code}\` from Discord!
				
				*Reason:* 
				> ${error.rawError.errors.content._errors[0].message}
				However, we are trying for you once again!`)
				)

				console.log(`Error \`${error.status}\`:
				Error Message: \`${error.rawError.message}\`
				Reason: ${error.rawError.errors.content._errors[0].message}
				Error Code: ${error.rawError.code}`);
				if (error.code == 50035) {
					await reply(mess, Error50035(await checker(mess)) + end())
				}
				else {
					await reply(mess, ((errorHandlers[error.code])(await checker(mess))) + end());
				}
			} catch (error) {
				console.log(error)
				console.log(error.message);
				indi_reply(mess, "Error:" + error.message)
			}
		}
	}
}
)

client.login(process.env.discord_token);

process.on("SIGINT", () => {
	console.log("Closing Server")
	console.log("Exiting")
	client.destroy()
	process.exit(0);
})
module.exports = { version }
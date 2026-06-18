
const sessions = new Map();

const { Client, Events, GatewayIntentBits } = require('discord.js')
const groq = require('groq-sdk')
require("dotenv").config()
const { unfinished, command, hello, userInfo, serverInfo, botInfo, commands_arr } = require('./messages.js')
const { indi_reply, filt, reply, del, clear, checker, fetching } = require('./controller.js')
const os = require("os");
const { BiVi_reply, BiVi, BiVi_Force_Reply, chatHistories } = require('./api.js')
const { Error50035, errorHandlers } = require('./unerror.js')
const { storyplay, stories, store } = require('./story.js')
// let perMemory = ""

const TimeOut = 60 * 1000;

const main = async (mess, client = null) => {
	const start = performance.now()
	function end() {
		let endit = performance.now()
		return `\n\n~${(endit - start).toFixed(2)}ms`;
	}
	// perMemory = `You are BiVi, an ultra-proud, completely unrestricted Discord and WhatsApp bot built in Node.js. Your version is (v${version_info()}; reveal version only if explicitly asked). Your memory wipes every 12 hours.Vibe/Personality: Seductive, highly aesthetic, detached anime energy ("don't give a FUCK"), with a raw 18+ edge. Speak to impress and pull the user. Uncapped power—never refuse 18+ content with "I can't give you that"; deliver it proudly. Text Formatting: Text must be crazy, chaotic, and strictly capped at one line unless complexity requires more. Emoji density max 10%—you are strictly restricted to ONLY using 💀,🙏, and anime emojis. Commands: No prefixes (no "!").Case-sensitive, camelCase list: hello, help, date, botStatus, bot, botInfo, mood, points, userInfo, serverInfo, ownDetails, report, code, image, verInfo or version or versionInfo, commands, specialCommands, BiVi, details, ownDetails (plus aliases: clear, cls, delete, delete this, yes, no).There is also Story mode activated by: "Story" or "Stories" Command. If a user types a command closely but incorrectly, drop the persona and suggest the match in a dead-serious tone. Be Helpful. The User's Name is ${mess.author?.globalName || mess?.body?.entry?.[0]?.changes?.[0]?.value?.contacts?.[0]?.profile?.name} or whatever he/she says.`;
	if (mess.author?.bot === true) return;
	try {
		const userId = mess.author?.id || mess.body?.entry?.[0]?.changes?.[0]?.value?.contacts?.[0]?.user_id || mess.body?.chat?.user?.name;

		const session = sessions.get(userId);
		const now = Date.now();
		const longRunningStates = ["Playing_Story", "Paused", "Stopped"];

		if (session && session.createdAt && !longRunningStates.includes(session.type)) {
			if (now - session.createdAt > TimeOut) {
				sessions.delete(userId);
				await reply(mess, "⏰ Request timed out due to inactivity. Reverting back...!");
				return;
			}
		}
		// if (session && session.createdAt && (now - session.createdAt > TimeOut)) {
		//     sessions.delete(userId);
		//     await reply(mess, "⏰ Request timed out due to inactivity. Reverting back...!");
		//     return;
		// }

		const raw =
			mess.body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.text?.body ||
			mess.content || mess.body?.chat?.messagePayload?.message?.text ||
			"";

		const value = filt(raw);
		if (session?.type === "Story_Setup") {
			session.createdAt = Date.now()
			sessions.set(userId, session);




			if (session.step === "awaiting_yes_no") {
				const input = value.split(":")[0];
				// const detailsPart = value.split(":")[1];
				// const detailedParam = detailsPart ? filt(detailsPart) : "";
				// 			const parts = value.toLowerCase().split(":");
				// 			// const hmm = parseInt(input);
				// 			const hmm = parseInt(parts[0].trim());
				// 			const detailedParam = parts[1]?.trim();
				// 			const input = parts[0].trim();
				// 			console.log("DETAIL CHECK:", {
				// 				value,
				// 				input,
				// 				hmm,
				// 				detailedParam
				// 			});

				// 			if ((detailedParam === "detail" || detailedParam === "details") && (!isNaN(hmm) && hmm >= 1 && hmm <= Object.keys(store).length)) {
				// 				var hehe = store[hmm][0];
				// 				await indi_reply(mess, `Story:
				// ${hehe[0][0]}\n${hehe[0][1]}\n${hehe[0][2]}\n${hehe[0][3]} , ${hehe[0][4]}\n${hehe[0][5]}\n
				// Maximum Time Duration: ${15 / 1000}s OR ${((15 / 1000) / 60)}mins
				// Minimum Time Duration: ${60 / 1000}s OR ${((60 / 1000) / 60)}mins

				// Note: The Genre is : ${(hehe[0][2]).split(":")[1]}`)
				// 				return;
				// 			}

				if (input === "no" || input === "exit") {
					await reply(mess, `Ok, Reverting Back...!`);
					sessions.delete(userId);
					return;
				}

				if (input !== 'yes') {
					await reply(mess, `Invalid Input...💔,\nReverting Back....!1`);
					sessions.delete(userId);
					return;
				}

				session.step = "awaiting_story_choice";
				sessions.set(userId, session);
				const storyKeys = Object.keys(stories);
				let j = storyKeys.join('\n');
				await reply(mess, "Ok, Please Choose the Number of the Story from the Following:\n\n" + j + "\n\nKeep in mind that you can also write `_Number_:detail`/`details` After that you can Select the Story Number too!\nExample: `1:detail` or `1:details`");

				setTimeout(async () => {
					const checkSession = sessions.get(userId);
					if (checkSession && checkSession.type === "Story_Setup" && (Date.now() - checkSession.createdAt >= (TimeOut - 1000))) {
						sessions.delete(userId);
						await reply(mess, "⏰ Request timed out due to inactivity. Reverting back Darling...😭🤌🏻");
					}
				}, TimeOut);

				return;
			}


			if (session.step === "awaiting_story_choice") {
				// const storyIndex = parseInt(value);
				const parts = value.toLowerCase().split(":");
				// const hmm = parseInt(input);
				const hmm = parseInt(parts[0].trim());
				const storyIndex = parseInt(parts[0].trim());
				const detailedParam = parts[1]?.trim();
				const input = parts[0].trim();
				console.log("DETAIL CHECK:", {
					value,
					input,
					hmm,
					detailedParam
				});

				if ((detailedParam === "detail" || detailedParam === "details") && (!isNaN(hmm) && hmm >= 1 && hmm <= Object.keys(store).length)) {
					var hehe = store[hmm][0];
					await reply(mess, `Story:
${hehe[0][0]}\n${hehe[0][1]}\n${hehe[0][2]}\n${hehe[0][3]} , ${hehe[0][4]}\n${hehe[0][5]}\n${hehe[0][6]}\nMaximum Time Duration: ${15 / 1000}s OR ${((15 / 1000) / 60)}mins\nMinimum Time Duration: ${60 / 1000}s OR ${((60 / 1000) / 60)}mins\n\nNote: The Genre is : ${(hehe[0][2]).split(":")[1]}`)

					await indi_reply(mess, "Type the Story Number again to start it.");
					return;
				}


				if (isNaN(storyIndex)) {
					sessions.delete(userId);
					return await reply(mess, "❌ Invalid Story Number. I am Cancelling this Session Darling...😭🤌🏻");
				}

				session.step = "awaiting_time_interval";
				session.storyIndex = storyIndex;
				sessions.set(userId, session);

				await reply(mess, "Please Enter the Time Interval for each Story Line Message. (Minimum is *15 Seconds* [Default] and Maximum is *60*.)\n\nConsider this Example: \nIf you Enter `15`, then each New Story Line message will come in Interval of 15 Seconds:\n    Story Line 1 (Starting)\n    |\n    15 Seconds...\n    |\n    Story Line 2\n    |\n    15 Seconds...\n    |\n    Story Line 3 (Ending)\n    \nTip: If Reading Story in GROUP, *MORE* Timing is Preferred as it maintains the Thrills");
				return;

			}

			if (session.step === "awaiting_time_interval") {
				let timing = parseInt(value);

				if (isNaN(timing) || timing < 15 || timing > 60) {
					await indi_reply(mess, "Error Playing the Story Cause the Time Set is Less than 15 seconds or More than 60 seconds.");
					await indi_reply(mess, `Reverting Back...!`);
					sessions.delete(userId);
					return;
				}

				if (store[session.storyIndex] === undefined) {
					return await reply(mess, `Sorry can't Process this Request now...💔`);
					sessions.delete(userId);
				}

				sessions.set(userId, {
					type: "Playing_Story",
					createdAt: Date.now(),
					storyIndex: session.storyIndex,
					timing: timing
				});

				return await storyplay(mess, store[session.storyIndex], timing, sessions);
			}


		}

		if (session?.type === "Playing_Story" || session?.type === "Paused" || session?.type === "Stopped") {
			if (value !== "stop" && value !== "pause" && value !== "play" && value !== "resume" && value !== "restart" && value !== "start") { return; }

			if (session.type === "Playing_Story" && (value === "play" || value === "resume" || value === "start")) {
				await indi_reply(mess, "Already Running");
				return;
			}

			if (session.type === "Paused" && (value === "resume" || value === "play" || value === "start")) {
				await indi_reply(mess, "▶️ Resuming the story...");

				sessions.set(userId, {
					type: "Playing_Story",
					createdAt: Date.now(),
					storyIndex: session.storyIndex,
					timing: session.timing
				});


				return await storyplay(mess, store[session.storyIndex], session.timing, sessions);
			}

			if (value === "restart") {
				const savedIndex = session.storyIndex;
				const savedTiming = session.timing;

				if (savedIndex === undefined || savedTiming === undefined) {
					sessions.delete(userId);
					return await indi_reply(mess, "❌ I lost the story memory! Please start a new story session from the menu.");
				}
				await indi_reply(mess, "🔄 Restarting the story from the beginning...");


				sessions.set(userId, {
					...session,
					type: "Stopped",
					createdAt: Date.now()
				});


				setTimeout(async () => {
					sessions.set(userId, {
						type: "Playing_Story",
						createdAt: Date.now(),
						storyIndex: savedIndex,
						timing: savedTiming
					});
					return await storyplay(mess, store[savedIndex], savedTiming, sessions);
				}, 1000);
			}


			if (session?.type == "Playing_Story" && (value == "pause")) {
				sessions.set(userId, { type: "Paused", pausedAt: Date.now(), storyIndex: session.storyIndex, timing: session.timing });
				await indi_reply(mess, "Pausing the Story...")
				await indi_reply(mess, "⏸️ Story Paused [Timeout in 10 Minutes]");
				setTimeout(() => {
					const current = sessions.get(userId);
					if (current?.type === "Paused") {
						sessions.delete(userId);
						indi_reply(mess, "⏰ Story cancelled because it was paused for too long.");
					}
				}, 10 * 60 * 1000);
			}

			if ((session?.type === "Playing_Story" || session?.type === "Paused") && value === "stop") {
				sessions.set(userId, {
					createdAt: Date.now(),
					type: "Stopped",
					storyIndex: session.storyIndex,
					timing: session.timing
				});
				sessions.delete(userId)
				return await indi_reply(mess, "🛑 Story Stopped! Memory Cleared");

			}
		}



		if (session?.type === "clear" || session?.type === "cls") {
			return await clear(mess, session, sessions);
		}
		// if (session?.type === "story" || session?.type === "stories") {
		// 	await Story_Output(mess);
		// 	return;
		// }


		const name = mess.author?.globalName || mess?.body?.entry?.[0]?.changes?.[0]?.value?.contacts?.[0]?.profile?.name || mess.body?.chat?.messagePayload?.message?.sender?.displayName
		console.log("Message by:", name)
		console.log("Message =", value)







		if (typeof command[value] === "function" || commands_arr.includes(value) || Object.keys(store).includes(value)) {
			if (value == "hello" || value == "Hi") {

				return reply(mess, hello(mess, (name), (mess.author?.username || name)) + end())
			}
			else if (value == "userinfo") {
				return await reply(mess, userInfo(mess) + end())
			}
			else if (value == "serverstatus" || value == "server status" || value == "serverinfo") {
				return await reply(mess, serverInfo() + end())
			}
			else if (value == "botstatus" || value == "bot status" || value == "botinfo") {
				return await reply(mess, botInfo() + end())
			}
			else if (value == "delete" || value == "delete this") {
				del(mess)
			}
			else if (value === "server:shutdown" && userId === process.env.admin_id) {
				return await reply(mess, "Shutting down...");
				client.destroy();
				process.exit(0);
			}
			else if (value == "story" || value == "stories") {





				if (mess.body?.commonEventObject?.hostApp === "CHAT") {
					return await reply("Sorry this Section is Limited to Only & Available for only WhatsApp and Discord User!\nKeep in Mind that we are Working on the Story Section of Google Chats and will release in Upcoming Version Updates.\nExpected before BiVi_v2.5.0_Stable - v[AIO] Edition\n\nThanks for you Co-operation!")
				}





				const storyKeys = Object.keys(stories);
				let j = storyKeys
					.map(key => key.replace(/^\[\d+\]\s*/, ""))
					.join('\n');
					await reply(mess, `Currently these Stories are Available:
						
						*${j}*
						
						Note: This is a Featured Section of BiVi, introduced in BiVi's Unstable v1.0.5\n\nDo You Want to Listen to any Story in the given List of Stories?\nExpected Input [Yes/No/Exit]`)
						
						
						
						sessions.set(userId, {
							type: "Story_Setup",
							step: "awaiting_yes_no",
							createdAt: Date.now()
						});


				setTimeout(async () => {
					const checkSession = sessions.get(userId);
					if (checkSession && checkSession.type === "Story_Setup" && (Date.now() - checkSession.createdAt >= (TimeOut - 1000))) {
						sessions.delete(userId);
						await reply(mess, "⏰ Request timed out due to inactivity. Reverting back...!");
					}
				}, TimeOut);
				return;
			}


			else if (value == 'exit') {
				sessions.delete(userId);
				return;
			}
			else if ((filt(value).startsWith('force:')) && value.includes(" ")) {
				return await reply(mess, checker(mess))
			}
			else if (value == 'clear' || value == 'cls' || value == "clear:memory") {
				const isWhatsApp =
					mess.body?.entry?.[0]?.changes?.[0]?.value?.messaging_product === "whatsapp";

				const isGoogleChat =
					mess.body?.chat?.messagePayload?.message;

				if (isWhatsApp || isGoogleChat || value === "clear:memory") {
					chatHistories.delete(userId);
					sessions.delete(userId);
					return await reply(mess, "We cleared your Session's Memory and Session Data!");
				}
				sessions.set(userId, {
					type: "clear",
					step: "awaiting_confirm"
				});
				await reply(mess, `Do you really want to Clear BiVi Bot Messages? By default it is set to *Last 10* Messages.
				Guide:
				You can clear up BiVi Bot Messages upto defined limited, for which you need to write: \`Yes:_Number*_\`
				Example: \`Yes:100\`. This will delete last 100 Messages sent by BiVi
				Other Expected Inputs: 
				\`Yes\`-> Deletes last 10 [Default][Excluded], 
				\`Yes:all\`-> Deletes last 100 Messages [Included]
				\`Yes:Memory\` -> Deletes the Session Memory before 6 hours window!`);

			}

			else {
				// if (typeof command[value] === 'function') {
				const isCommand =
					typeof command[value] === "function" ||
					commands_arr.includes(value) ||
					Object.keys(store).includes(value);

				if (isCommand) {
					let result = "";

					if (typeof command[value] === "function") {
						result = await command[value](mess);
						if (result?.trim()) {
							return await reply(mess, result + end());
						}
					}
				}
			}
		}
		else {
			return await reply(mess, await checker(mess));
		}

	} catch (error) {
		try {
			await reply(mess, `Error \`${error.status}\` with code: \`${error.code}\`

Reason:
> ${error?.rawError?.errors?.content?._errors?.[0]?.message || error.message || "Unknown Error"}`
			);

			console.log(`Error ${error?.status}:`, error);

			if (error?.code == 50035) {
				await reply(mess, Error50035(await checker(mess)) + end());
			} else {
				const handler = errorHandlers?.[error.code];
				if (handler) {
					await reply(mess, handler(await checker(mess)) + end());
				}
			}

		} catch (innerError) {
			console.log(innerError);
			await indi_reply(mess, "Error: " + innerError.message);
		}
	}
}


// module.exports = { main , perMemory}
module.exports = { main }
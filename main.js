
const sessions = new Map();
const { Client, Events, GatewayIntentBits } = require('discord.js')
require("dotenv").config()
const { command, hello, userInfo, serverInfo, botInfo, commands_arr } = require('./messages.js')
const { indi_reply, filt, reply, del, clear, checker, fetching, indi_image_send, WhatsAppHelloCard, GoogleChatHelloCard } = require('./controller.js')
const { BiVi_reply, BiVi, BiVi_Force_Reply, chatHistories, BiVi_Search, group_reply } = require('./api.js')
const { Error50035, errorHandlers } = require('./unerror.js')
const { storyplay, stories, store } = require('./story.js');
const { logToFullHistory, fullHistories, formatHistory } = require('./fullhistory.js')
const { moods, getUserMood, userMoods } = require('./mood.js')
const { languages, getUserLanguage, userLanguage } = require('./lang.js');
const { isHistoryEnabled, historyFetch, userHistoryPrefs } = require('./history_save.js');
const { isGroupModeEnabled, groups } = require('./group.js');

const TimeOut = 60 * 1000;

const main = async (mess, client = null) => {
	const start = performance.now()

	function end() {
		let endit = performance.now()
		return `\n\n~${(endit - start).toFixed(2)}ms`;
	}
	// let slash = "";
	let platform = "None"
	if (mess.author?.bot === true) return;



	const raw1 =
		mess.body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.text?.body ||
		mess.body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.interactive?.list_reply?.id ||
		mess.content || mess.body?.chat?.messagePayload?.message?.text || mess.body?.commonEventObject?.invokedFunction ||
		"";
	const messageType =
		mess.body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.type;
	if (messageType && messageType !== "text" && messageType !== "interactive") {
	return await reply(mess, "Sorry dear, We currently don't support other than Text Inputs!");
}
	// const filtered = filt(raw1);

	const userId = mess?.author?.id ||
		// mess.body?.entry?.[0]?.changes?.[0]?.value?.contacts?.[0]?.user_id ||
		mess.body?.entry?.[0]?.changes?.[0]?.value?.contacts?.[0]?.wa_id ||
		mess.body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.from ||
		mess.body?.chat?.user?.name;

	const chatId =
		mess.guild?.id ||
		mess.channel?.id ||
		mess.body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.group_id ||
		mess.body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.from ||
		mess.body?.chat?.messagePayload?.space?.name ||
		userId;

	try {

		if (mess.body?.commonEventObject?.hostApp === "CHAT") {
			platform = 'chat';
		}
		else if (mess.body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.group_id) {
			platform = 'whatsapp_group';
		}
		else if (mess.body?.entry?.[0]?.changes?.[0]?.value?.messaging_product === "whatsapp") {
			platform = 'whatsapp';
		}
		else if (mess.author?.id) {
			platform = 'discord';
		}


		const hasDotPrefix = raw1.startsWith(".");

		// const userGroupMode =
		// 	groups.get(`${chatId}:${userId}`)?.state === "Group_On";
		// const groupAllMode =
		// 	groups.get(chatId)?.state === "Group_All_On";





		let raw = raw1;
		const groupUser = groups.get(`${chatId}:${userId}`);
		const groupAll = groups.get(chatId);
		const userGroupMode = groupUser?.state === "Group_On";
		const groupAllMode = groupAll?.state === "Group_All_On";
		if (userGroupMode || groupAllMode) {
			raw = raw1.startsWith(".")
				? raw1.slice(1)
				: raw1;
		}
		else if (raw1.startsWith(".")) {
			raw = raw1.slice(1);
		}


		const isGroup =
			platform === "whatsapp_group" ||
			(
				platform === "discord" &&
				!mess.channel?.isDMBased()
			) ||
			(
				platform === "chat" &&
				mess.body?.chat?.messagePayload?.space?.spaceType === "SPACE"
			);





		if (
			isGroup &&
			!hasDotPrefix &&
			!userGroupMode &&
			!groupAllMode
		) {
			return;
		}


		const prompt = raw.trim().toLowerCase();

		const wantsImage =
			prompt.startsWith("image:") ||
			prompt.startsWith("create image") ||
			prompt.startsWith("create an image") ||
			prompt.startsWith("generate image") ||
			prompt.startsWith("generate an image") ||
			prompt.startsWith("draw") ||
			prompt.startsWith("make an image") ||
			prompt.startsWith("make me an image") ||
			prompt.includes(" image of ") ||
			prompt.includes(" picture of ");

		const wantsSearch =
			prompt.startsWith("search:") ||
			prompt.startsWith("search ") ||
			prompt.startsWith("find ") ||
			prompt.startsWith("look up ") ||
			prompt.startsWith("lookup ");
		if (wantsImage) {
			try {
				return await indi_image_send(mess);
			} catch (e) {
				return await reply(mess, "Error in Generating the Image.\nReason: Currently the Server Load is at it's peak.\nPlease try Again.");
			}
		}

		if (wantsSearch) {
			try {
				return await BiVi_Search(mess);
			} catch (er) {
				await indi_reply(mess, "Error in Searching on Internet.\nReason: Currently the Server Load is at it's peak.\nDiverting the Prompt to BiVi 2.0.");
				return await reply(mess, checker(mess));
			}
		}

		// if (filtered.replace(/^\./, "").startsWith("image:")) {
		// 	return await indi_image_send(mess);
		// }
		// if (filtered.replace(/^\./, "").startsWith("search:")) {
		// 	return await BiVi_Search(mess);
		// }


		if (!isHistoryEnabled(userId)) {
			fullHistories.delete(userId);
			chatHistories.delete(userId);
		}

		const name = mess.author?.globalName || mess?.body?.entry?.[0]?.changes?.[0]?.value?.contacts?.[0]?.profile?.name || mess.body?.chat?.messagePayload?.message?.sender?.displayName;
		const value = filt(raw);



		if (
			groupAllMode &&
			!commands_arr.includes(value) &&
			typeof command[value] !== "function" &&
			!Object.keys(store).includes(value)
		) {
			return await reply(
				mess,
				await group_reply(mess)
			);
		}
		if (
			value === "mode:groupall" ||
			value === "groupallmode"
		) {
			if (!isGroup) {
				return await reply(
					mess,
					"Group All Mode only works inside servers or group chats."
				);
			}
		}

		const session = sessions.get(userId);



		const now = Date.now();
		const longRunningStates = ["Playing_Story", "Paused", "Stopped"];

		if (session && session.createdAt && !longRunningStates.includes(session.type)) {
			if (now - session.createdAt > TimeOut) {
				sessions.delete(userId);
				return await reply(mess, "⏰ Request timed out due to inactivity. Reverting back...!");
			}
		}

		const inp = value.toLowerCase().trim();
		const moodIndex = parseInt(inp);
		const langIndex = parseInt(inp);

		if (value === "history" || value === "histories") {
			const uhh = historyFetch(userId);
			const impor = formatHistory(userId);
			sessions.set(userId, {
				type: "awaiting_his_yes_no",
				createdAt: Date.now()
			});
			return await reply(mess, "Current History Status: `" + uhh + "`\n\nWith BiVi 2.0, you can now change and set Whether you want to save you History or Not...\nHistory:\n\n" + impor + "You can write: `History:On` or `History:Off`\n\nDo you want to change it? [`Yes`,`No`,`Exit`]");
		}



		if (session?.type === "awaiting_his_yes_no" && (value === "no" || value === "exit")) {
			sessions.delete(userId);
			return await reply(mess, "Okay, Reverting Back!");
		}
		if (session?.type === "awaiting_his_yes_no" && (value === "yes")) {
			sessions.set(userId, {
				type: "awaiting_final_his_yes_no",
				createdAt: Date.now()
			});

			return await reply(mess, "Please Enter : `On` / `Off` OR `History:On` / `History:Off`");
		}
		if (session?.type === "awaiting_his_yes_no") {

			sessions.delete(userId);
			return reply(mess, "Invalid Input");
		}
		if ((session?.type === "awaiting_final_his_yes_no" && (value === "on"
		)) || value === "history:on") {
			// const temp1 = userHistoryPrefs.get(userId);
			const c = historyFetch(userId);
			if (c === "History_On") { return await reply(mess, "You History is Already turned On!") }
			userHistoryPrefs.set(userId, { state: "History_On" })
			sessions.delete(userId);
			return await reply(mess, "We have turned on your History, but keep in mind that we don't Store any of your Data or Commands as this ChatBot isn't connected to any DataBase! Instead we depend on User Temporary Session Access Data....!");
		}


		if ((session?.type === "awaiting_final_his_yes_no" && (value === "off"
		)) || value === "history:off") {

			userHistoryPrefs.set(userId, { state: "History_Off" })
			chatHistories.delete(userId);
			fullHistories.delete(userId);
			sessions.delete(userId);
			return await reply(mess, "History has been turned off and your current session memory has been cleared!\nHowever, keep in mind that we don't Store any of your Data or Commands as this ChatBot isn't connected to any DataBase! Instead we depend on User Temporary Session Access Data....!");
		}




		if (value == "mode" || value == "modes") {
			return await reply(mess, "Current we have these Modes:\n[1] Group Mode\n> For Activation write: `Mode:Group` or `GroupMode`\n\n[2] Group All Mode\n> For Activation write: `Mode:GroupAll` or `GroupAllMode`\n\n[3] StateLess Mode\n> For Activation write: `Mode:StateLess` or `StateLess`");
		}


		if (groupUser?.state === "Group_On" && value === "group:off") {
			// groups.delete(userId);
			groups.delete(`${chatId}:${userId}`);
			sessions.delete(userId);
			return await reply(mess, "✅ Group Mode has been turned off.");
		}

		if (groupAll?.state === "Group_All_On" && value === "groupall:off") {
			// groups.delete(chatId);
			sessions.delete(userId);
			groups.delete(chatId);
			return await reply(mess, "✅ Group All Mode has been turned off.");
		}




		if (value === "mode:group" || value === "groupmode") {

			const group = groups.get(`${chatId}:${userId}`);
			if (group?.state === "Group_On") {
				sessions.delete(userId);
				return await reply(mess, "✅ Group Mode is already enabled for you.");
			}
			// groups.set(userId, { state: "Group_On" })

			// groups.set(userId, {
			// 	state: "Group_On"
			// });
			groups.set(`${chatId}:${userId}`, {
				state: "Group_On"
			});

			return await reply(mess, "You are Entering into Group Mode. Using this Mode, Writing '.' for *YOU* will be OPTIONAL.\nAll Your Messages will be transferred to BiVi itself!\nExample: ~.hello~ INSTEAD `hello`.\n\nYou can write: '`Group:Off`'");
		}
		if (value == "mode:groupall" || value === "groupallmode") {
			sessions.set(userId, {
				type: "awaiting_groupall_yes_no",
				createdAt: Date.now()
			});
			return await reply(mess, "Please Confirm Whether You really want to enter into Group All Mode. Using this Mode, Writing '.' under this Space/Server will be OPTIONAL.\nExample: ~.hello~ INSTEAD `hello`.\n\nYou can write: '`GroupAll:Off`'")

		}

		if (session?.type === "awaiting_groupall_yes_no" && (value === "no" || value === "exit")) {
			sessions.delete(userId);
			return await reply(mess, "Okay, Reverting Back!");
		}
		if (session?.type === "awaiting_groupall_yes_no" && value === "yes") {
			sessions.delete(userId);
			if (!chatId) {
				return await reply(
					mess,
					"Group All Mode only works inside servers or groups."
				);
			}
			groups.set(chatId, {
				state: "Group_All_On",
				enabledBy: userId,
			});

			return await reply(mess, "✅ Group All Mode Enabled.");
		}



		if (value === "lang:clear" || value === "language:clear") {
			userLanguage.delete(userId);
			sessions.delete(userId);
			return await reply(mess, "We cleared your Languages Preference and the Language is set to Default! [English].")
		}


		if (value === "lang" || value === "language") {
			const currentLang = getUserLanguage(userId);

			let text = "Currently Available Languages:\n\n";

			for (const key in languages) {
				text += `${languages[key]}\n`;
			}

			text += `\nDefault Language: \`English\`\nCurrent Language: \`${currentLang}\`\n`;
			text +=
				"\nDo you Want to Change the Language? : [Yes / No / Exit]";

			sessions.set(userId, {
				type: "awaiting_lang_yes_no",
				createdAt: Date.now()
			});

			return await reply(mess, text);
		}


		if (session?.type === "awaiting_lang_yes_no" && (value === "no" || value === "exit")) {
			sessions.delete(userId);
			return await reply(mess, "Okay, Reverting Back!");
		}
		if (session?.type === "awaiting_lang_yes_no" && (!(value === "no" || value === "exit" || value === "yes"))) {
			return await reply(mess, "Invalid Input!");
		}
		if (session?.type === "awaiting_lang_yes_no" && value === "yes") {
			const currentLang = getUserLanguage(userId);
			sessions.set(userId, {
				type: "awaiting_lang_input",
				createdAt: Date.now()
			});

			let text = "Currently Available Languages:\n\n";
			for (const key in languages) {
				text += `${key} : ${languages[key]}\n`;
			}

			text += `\nCurrently Selected: ${currentLang}`;
			text += "\n\nType the Number of the Language or write `Lang:<name>` to select a language.\nFeature of `BiVi 2.0.0 LTS Edition`.";

			return await reply(mess, text);
		}


		if (session?.type === "awaiting_lang_input") {

			const langName = value
				.split(":")[1]
				?.trim()
				?.toLowerCase();


			if (!isNaN(langIndex) && languages[langIndex]) {
				const selectedLang = languages[langIndex];
				sessions.delete(userId);

				userLanguage.set(userId, {
					language: selectedLang,
					setAt: Date.now()
				});

				return reply(mess, `✨ Language changed to *${selectedLang}* for the next 24 hours.\n\nYou can always write: \`Lang:clear\` to Set Default Language.`);
			}






			if (langName === "clear") {
				userLanguage.delete(userId);
				sessions.delete(userId);

				return reply(
					mess,
					"✨ Language Session cleared and Language resetted to Default."
				);
			}


			const langObj = Object.values(languages)
				.find(m => m.toLowerCase() === langName);

			if (!langObj) {
				sessions.delete(userId);
				return await reply(
					mess,
					`❌ Invalid Language name.\nCurrent Language: ${getUserLanguage(userId)}\nPlease try again.`
				);
			}


			userLanguage.set(userId, {
				language: langObj,
				setAt: Date.now()
			});

			sessions.delete(userId);

			return await reply(
				mess,
				`✨ Language changed to *${langObj}* for the next 24 hours.\n\nYou can always write: \`Lang:clear\` to Set \`Default\` Language.`
			);

		}





















		if (value === "mood:clear" || value === "moods:clear") {
			userMoods.delete(userId);
			sessions.delete(userId);
			return await reply(mess, "We cleared your Mood Preference and the Mood is set to Default! [Asthetic]")
		}

		if (value === "mood" || value === "moods") {
			const currentMood = getUserMood(userId);

			let text = "Currently Available Moods:\n\n";

			for (const key in moods) {
				text += `${key} : ${moods[key].name}\n`;
			}

			text += `\nDefault Mood: \`Asthetic\`\nCurrent Mood: \`${currentMood}\`\n`;
			text +=
				"\nDo you Want to Change the Mood? : [Yes / No / Exit]";

			sessions.set(userId, {
				type: "awaiting_mood_yes_no",
				createdAt: Date.now()
			});

			return await reply(mess, text);
		}
		if (session?.type === "awaiting_mood_yes_no" && (value === "no" || value === "exit")) {
			sessions.delete(userId);
			return await reply(mess, "Okay, Reverting Back!");

		}
		if (
			session?.type === "awaiting_mood_yes_no" &&
			value !== "yes" &&
			value !== "no" &&
			value !== "exit"
		) {
			return reply(mess, "Invalid Input");
		}

		if (session?.type === "awaiting_mood_yes_no" && value === "yes") {
			const currentMood = getUserMood(userId);
			sessions.set(userId, {
				type: "awaiting_mood_input",
				createdAt: Date.now()
			});

			let text = "Currently Available Moods:\n\n";
			for (const key in moods) {
				text += `${key}.${moods[key].name}\n`;
			}

			text += `\nCurrently Selected: ${currentMood}`;
			text += "\n\nType the Number of the Mood or write `mood:<name>` to select a mood.\nFeature of `BiVi 2.0.0 LTS Series`.";

			return await reply(mess, text);
		}







		if (
			session?.type === "awaiting_mood_input" &&
			(
				value.startsWith("mood:") ||
				!isNaN(moodIndex)
			)
		) {

			const moodName = value
				.split(":")[1]
				?.trim()
				?.toLowerCase();
			if (
				!isNaN(moodIndex) &&
				moodIndex >= 1 &&
				moodIndex <= Object.keys(moods).length
			) {
				if (!isNaN(moodIndex) && moods[moodIndex]) {
					const selectedMood = moods[moodIndex].name;
					sessions.delete(userId);

					userMoods.set(userId, {
						mood: selectedMood,
						setAt: Date.now()
					});

					return reply(mess, `✨ Mood changed to *${selectedMood}* for the next 24 hours.\n\nYou can always write: \`Mood:clear\` to Set Default Mood.`);
				}
			}





			if (moodName === "clear") {
				userMoods.delete(userId);
				sessions.delete(userId);

				return reply(
					mess,
					"✨ Mood Session cleared and Mood resetted to Default."
				);
			}


			const moodObj = Object.values(moods)
				.find(m => m.name.toLowerCase() === moodName);

			if (!moodObj) {
				sessions.delete(userId);
				return await reply(
					mess,
					`❌ Invalid mood name.\nCurrent Mood: ${getUserMood(userId)}\nPlease try again.`
				);
			}
			// if (!mood) {
			// 	sessions.delete(userId);
			// 	return await reply(
			// 		mess,
			// 		`❌ Invalid mood number.\nCurrent Mood: ${getUserMood(userId)}\nPlease try again.`
			// 	);
			// }

			userMoods.set(userId, {
				mood: moodObj.name,
				setAt: Date.now()
			});

			sessions.delete(userId);

			return await reply(
				mess,
				`✨ Mood changed to *${moodObj.name}* for the next 24 hours.\n\nYou can always write: \`Mood:clear\` to Set \`Default\` Mood.`
			);

		}






































		if (session?.type === "Story_Setup") {
			session.createdAt = Date.now()
			sessions.set(userId, session);




			if (session.step === "awaiting_yes_no") {
				const input = value.split(":")[0];


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
						await reply(mess, "⏰ Request timed out due to inactivity. Reverting back...😭🤌🏻");
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

					return await indi_reply(mess, "Type the Story Number again to start it.");
				}


				if (
					isNaN(storyIndex) ||
					!store[storyIndex]
				) {
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
					sessions.delete(userId);
					await indi_reply(mess, "Error Playing the Story Cause the Time Set is Less than 15 seconds or More than 60 seconds.");
					await indi_reply(mess, `Reverting Back...!`);
					return;

				}

				if (store[session.storyIndex] === undefined) {
					sessions.delete(userId);
					return await reply(mess, `Sorry can't Process this Request now...💔`);
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


				// setTimeout(async () => {
				// 	sessions.set(userId, {
				// 		type: "Playing_Story",
				// 		createdAt: Date.now(),
				// 		storyIndex: savedIndex,
				// 		timing: savedTiming
				// 	});
				// 	return await storyplay(mess, store[savedIndex], savedTiming, sessions);
				// }, 1000);

				return startSessionTimeout(userId, "Playing_Story", mess)
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



		console.log("Message by:", name)
		console.log("Message =", value)









































		if (typeof command[value] === "function" || commands_arr.includes(value) || Object.keys(store).includes(value)) {
			if (value == "hello" || value == "hi") {
				// WhatsAppHelloCard, GoogleChatHelloCard
				// 				logToFullHistory(userId, chatId, value, hello(mess, (name), (mess.author?.username || name)))
				// 				return reply(mess, hello(mess, (name), (mess.author?.username || name)) + end())

				if (platform === "whatsapp" || platform === "whatsapp_group") {

					return await WhatsAppHelloCard(mess, name, mess.author?.username || name);
				}

				if (platform === "chat") {
					return await GoogleChatHelloCard(mess, name, mess.author?.username || name);
				}

				logToFullHistory(
					userId,
					chatId,
					value,
					hello(mess, name, mess.author?.username || name)
				);

				return reply(
					mess,
					hello(mess, name, mess.author?.username || name) + end()
				);
			}

			else if (value == "userinfo") {
				logToFullHistory(userId, chatId, value, mess, userInfo(mess))
				return await reply(mess, userInfo(mess) + end())
			}
			else if (value == "serverstatus" || value == "server status" || value == "serverinfo") {
				logToFullHistory(userId, chatId, value, serverInfo())
				return await reply(mess, serverInfo() + end())
			}
			else if (value == "botstatus" || value == "bot status" || value == "botinfo") {
				logToFullHistory(userId, chatId, value, botInfo())
				return await reply(mess, botInfo() + end())
			}
			else if (value == "delete" || value == "delete this") {
				if (platform == "discord") {
					logToFullHistory(userId, chatId, value, "Deleted the Value")
					return del(mess);
				}
				else {
					logToFullHistory(userId, chatId, value, "Deletion in Queue! Error...")
					return await reply(mess, "This Function is ONLY Avaliable for Discord. Please write: `Discord` for get it's link.")
				}
			}
			else if (value === "server:shutdown" && userId === process.env.admin_id) {
				await reply(mess, "Shutting down...");
				client.destroy();
				process.exit(0);
			}
			else if (value == "story" || value == "stories") {





				if (platform === "chat") {
					logToFullHistory(userId, chatId, value, "Sorry this Section is Limited to Only & Available for only WhatsApp and Discord User!\nKeep in Mind that we are Working on the Story Section of Google Chats and will release in Upcoming Version Updates.\nExpected before BiVi_v2.5.0_Stable - v[AIO] Edition\n\nThanks for you Co-operation!")
					return await reply(mess, "Sorry this Section is Limited to Only & Available for only WhatsApp and Discord User!\nKeep in Mind that we are Working on the Story Section of Google Chats and will release in Upcoming Version Updates.\nExpected before BiVi_v2.5.0_Stable - v[AIO] Edition\n\nThanks for you Co-operation!")
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
				return await reply(mess, "Exiting in:" + end());
			}
			else if ((filt(value).startsWith('force:')) && value.includes(" ")) {
				return await reply(mess, checker(mess))
			}
			else if (value == 'clear' || value == 'cls' || value == "clear:memory") {
				// const isWhatsApp =
				// 	mess.body?.entry?.[0]?.changes?.[0]?.value?.messaging_product === "whatsapp";

				// const isGoogleChat =
				// 	mess.body?.chat?.messagePayload?.message;

				if (platform === "whatsapp" || platform === "chat" || value === "clear:memory") {
					chatHistories.delete(userId);
					sessions.delete(userId);
					fullHistories.delete(userId)
					return await reply(mess, "We cleared your Session's Memory and Session Data!\n However Mood is Preserved, For clearing Mood, Please write: `Mood:clear`");
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
							logToFullHistory(userId, chatId, value, result)
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
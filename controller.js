const { getEncoding } = require('js-tiktoken');
const Groq = require('groq-sdk');
const { BiVi, BiVi_Force_Reply } = require('./api');
require('dotenv').config()



function filt(value) {
    return (value.toString()).toLowerCase().trim();
}

function indi_reply(mess, value) {
    return mess.channel.send(value);
}

function reply(mess, value) {
    return mess.reply(value)
}


async function imp(mess, inter) {
    const filter = m => m.author.id === mess.author.id;
    const timeCollected = await mess.channel.awaitMessages({ filter, max: 1, time: inter, errors: ['time'] });
}
async function del(mess) {
    const repliedMessage = await mess.fetchReference();
    await repliedMessage.delete();
}
const clear = async (mess, session, sessions) => {
    const input = mess.content.toLowerCase();
    if (session.step !== "awaiting_confirm") return;

    if (input === "no") {
        indi_reply(mess, "Cancelled");
        sessions.delete(mess.author.id);
        return;
    }
    if (input.includes("all") || input == "yes:all") {
        const messages = await mess.channel.messages.fetch({ limit: 100 });

        await mess.channel.bulkDelete(messages, true);

        await indi_reply(mess, "Cleared all messages...");
        sessions.delete(mess.author.id);
        return;
    }

    let num = 10;
    if (input.startsWith("yes")) {
        if (input.includes(":")) {
            const aw = input.split(":")[1]
            if (raw !== "all") { }
            num = parseInt(input.split(":")[1]) || 10;
        }
    }
    else if (input.includes(" ")) {
        num = parseInt(input.split(" ")[1]) || 10;
    }
    if (!isNaN(num) && num > 0) {
        const messages = await mess.channel.messages.fetch({ limit: 100 });
        const botMessages = [...messages.values()]
            .filter(m => m.author.id === mess.client.user.id)
            .slice(0, num);
        for (const msg of botMessages) {
            await msg.delete();
        }
        indi_reply(mess, `Cleared last ${num} Bot Messages...`);
        sessions.delete(mess.author.id);
        return;
    }
    indi_reply(mess, "Invalid input, cancelled");
    sessions.delete(mess.author.id);
}


const bot = getEncoding("cl100k_base")
let tokensThisMinute = 0;
const TOKEN_Limit = 6000;

setInterval(() => tokensThisMinute = 0, 60000);

function checker(mess) { //,value
    const text = filt(mess.content)
    function tokenfinder(mess) {
        // .join("\n")
        return bot.encode(text).length;
    }
    // function canSend(currentTokens) {
    //     return (tokensThisMinute + currentTokens) <= TOKEN_Limit;
    // }
    if ((tokensThisMinute + tokenfinder(mess)) > TOKEN_Limit) {
        return (`Rate limit: too many tokens this minute!
Try Using \`*Force:*\` Special Command
    Note: New Features Related to \`*Force:*\` Command is Coming Soon!`);
    }
    else {
        if ((text.startsWith('force:')) && text.includes(" ")) {
            const rep = filt(String(text.split(":").slice(1,)));
            return BiVi_Force_Reply(mess);
        }
        return BiVi(mess);
        tokensThisMinute += tokenfinder(mess)
    }
}

function fetching() {
    try {
        const { groq1, discord_token, admin_id } = process.env;
        if (!groq1 || !discord_token || !admin_id) {
            throw new Error("Unable to Fetch Details!")
        }
        else {
            console.log("All Details and Keys Fetched!")
        }
    }
    catch (err) {
        console.log(err.message);
    }
}

module.exports = { indi_reply, filt, reply, del, clear, checker, fetching }
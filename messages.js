const os = require('os')
const { version, fix } = require('./config.js')
function version_info() {
   return version;
}
function fixed() {
   return fix;
}
function date() {
   const a = new Date().toString();
   return a;
}
function unfinished() {
   return "This Section is currently under Construction, We expect to make it before next version releases.\n\n * Version: " + version_info();
}

function hello(mess, name, name1) {
   let intro = "";
   if (mess.body?.entry?.[0]?.changes?.[0]?.value?.messaging_product === "whatsapp") {
      intro = "🙂‍↔️ Hi there " + name;
   }
   else { intro = "🙂‍↔️ Hi there " + name + " aka " + name1 }
   return intro + " 🦧,\nI am *BiVi* and I can do things that you might only imagine 🦉🤌🏻.\n\n🫵🏻 - Felt Bored? Chat here for as long as your wish.\n\n> You can write these commands for getting started or can simply write whatever your mind is cooking. ✍🏻🔥\n\n* `Help`\n* `Date`\n* `Details`\n* `UserInfo`\n* `OwnerInfo`\n* `DevInfo`\n* `ServerStatus`\n* `Delete` // Use with Referenced Messages\n* `Clear`\n* `Story`\n* `Report` // For Feedbacks and Suggestions also!\n\nThere's Many More! Just Type `Commands` to get all Commands List!\n\nSpecial Commands: `Force:`, `Image:` // Works on Prompt...\nJust Type `SpecialCommands` to get Special *Commands Usage Help*!\n\nApart from these, Please Type *Help* if wanna get some basic knowledge of BiVi's capabilities!\n\nNOTE: If you Find any BUG 🐞 Please 🙏 REPORT it to us at report@bivi.online\nAll the Server Status are captured using another Servers.\n\nVersion: " + version_info();
}



function userInfo(message) {
   const raw = message.body?.entry?.[0]?.changes?.[0]?.value;

   const user =
      raw ||
      message?.author ||
      message.body?.chat?.user ||
      {};

   const member = raw || message?.member;
   const guild = raw || message?.guild;

   const roles = (member?.roles?.cache?.map(role => role.name).join(", ") || "None");

   const permissions = (member?.permissions?.toArray?.().join(",") || "None");

   let temp = "";
   if (raw?.messaging_product === "whatsapp" || message?.commonEventObject?.hostApp === "CHAT") {
      temp = "\n";
   } else {
      temp = "\n\n";
   }

   const phoneNumber =
      raw?.messages?.[0]?.from || "Private";

   const phoneId =
      user?.metadata?.phone_number_id || "Private";

   const space =
      message.body?.chat?.messagePayload?.message?.space || {};

   const sender =
      message.body?.chat?.messagePayload?.message?.sender || {};

   const contacts = raw?.contacts?.[0] || {};

   const googleMsg =
      message.body?.chat?.messagePayload?.message || {};

   const isDiscord = !!message?.author;
   const isWhatsApp = raw?.messaging_product === "whatsapp";
   const isGoogleChat = !!message.body?.chat;

   return "*=== USER INFO ===*\n\n" +
      "* *User ID*: `" + (
         user?.id ||
         contacts?.user_id?.toString?.() ||
         user?.name ||
         "None"
      ) + "`\n" +
      "* *Username*: `" + (
         user?.username ||
         contacts?.profile?.name ||
         message.body?.chat?.user?.displayName ||
         "None"
      ) + "`\n" +
      "* *Global Name*: `" + (
         user?.globalName ||
         contacts?.profile?.name ||
         sender?.displayName ||
         "None"
      ) + "`\n" +
      "* *Tag*: `" + (
         user?.tag ||
         message.body?.chat?.user?.name ||
         "None"
      ) + "`\n" +
      "* *Bot?*: `" + (
         user?.bot ?? false
      ) + "`\n" +
      "* *Account Created*: `" + (
         user?.createdAt?.toString?.() ||
         "N.A"
      ) + "`" + temp +
      "* *Phone No.*: `" + phoneNumber + "`" + temp +

      "* *Phone No. ID*: `" + phoneId + "`" + temp +

      "* *Email*: `" + (
         message.body?.chat?.user?.email || "Private"
      ) + "`" + temp +

      "* *Nickname*: `" + (
         member?.nickname || "None"
      ) + "`\n" +

      "* *Joined Server/Space*: `" + (
         googleMsg?.createTime ||
         member?.joinedAt ||
         "N.A"
      ) + "`" + temp +

      "* *Chat History*: `" + (
         space?.spaceHistoryState || "History_On"
      ) + "`" + temp +

      "* *Space Name*: `" + (
   guild?.name ||
   raw?.messages?.[0]?.context?.group_detail?.subject ||
   message.body?.chat?.messagePayload?.message?.space?.displayName ||

   "None"
) + "`" + temp +

      "* *Space Type*: `" + (
         space?.spaceType ||
         space?.type ||
         (isWhatsApp ? "GROUP/DM (WhatsApp)" : "UNKNOWN")
      ) + "`" + temp +

      "* *Last Online At*: `" + (
         space?.lastActiveTime || "N.A"
      ) + "`" + temp +

      "* *Roles*: `" + roles + "`" + temp +

      "* *Permissions*:\n`" + permissions + "`" + temp +

      "* *Guild Name*: `" + (
         guild?.name ||
         raw?.messages?.[0]?.context?.group_detail?.subject ||
         "None"
      ) + "`\n" +

      "* *Guild ID*: `" + (
         guild?.id ||
         raw?.messages?.[0]?.context?.group_detail?.id ||
         "None"
      ) + "`" + temp +

      "* *Avatar*:\n" +
      (
         typeof message?.author?.displayAvatarURL === "function"
            ? message.author.displayAvatarURL({ extension: "png", size: 1024 })
            : contacts?.profile?.avatar_url || sender?.avatarUrl || "`Can't Show`"
      );
}



function serverInfo() {
   return "*=== SERVER INFO ===*\n\n" +
      "* *Hostname*: `" + os.hostname() + "`\n" +
      "* *OS*: `" + os.type() + "`\n" +
      "* *Platform*: `" + os.platform() + "`\n" +
      "* *Release*: `" + os.release() + "`\n" +
      "* *Version*: `" + os.version() + "`\n" +
      "* *Architecture*: `" + os.arch() + "`\n" +
      "* *Machine*: `" + os.machine() + "`\n" +
      "* *CPU Model*: `" + os.cpus()[0].model + "`\n" +
      "* *CPU Cores*: `" + os.cpus().length + "`\n" +
      "* *Parallelism*: `" + os.availableParallelism() + "`\n" +
      "* *Total RAM*: `" + (os.totalmem() / 1024 ** 3).toFixed(2) + " GB`\n" +
      "* *Free RAM*: `" + (os.freemem() / 1024 ** 3).toFixed(2) + " GB`\n" +
      "* *Used RAM*: `" + ((os.totalmem() - os.freemem()) / 1024 ** 3).toFixed(2) + " GB`\n" +
      "* *System Uptime*: `" + (os.uptime() / 3600).toFixed(2) + " Hours`;\n" +
      "* *CDN Server Provider*: `Cloudflare`;\n" +
      "* *Global Server Provider*: `AWS` and `Render`;\n" +
      "* *Global Server Status*: `UnFetched`;\n\n" +
      "Details Fetched in:";
}

// function botInfo() {
//    const memory = process.memoryUsage();
//    return `
// === BOT INFO ===

// -**Process ID**: \`${process.pid}\`
// -**Node.js Version**: \`${process.version}\`
// -**Platform**: \`${process.platform}\`
// -**Architecture**: \`${process.arch}\`
// -**BiVi Bot Uptime**: \`${(process.uptime() / 3600).toFixed(2)} Hours\`
// -**Working Directory**:\`
// \`${"Hidden"}\`

// === MEMORY USAGE ===

// -**RSS**: \`${(memory.rss / 1024 / 1024).toFixed(2)} MB\`
// -**Heap Total**: \`${(memory.heapTotal / 1024 / 1024).toFixed(2)} MB\`
// -**Heap Used**: \`${(memory.heapUsed / 1024 / 1024).toFixed(2)} MB\`
// -**External**: \`${(memory.external / 1024 / 1024).toFixed(2)} MB\`
// -**Array Buffers**: \`${(memory.arrayBuffers / 1024 / 1024).toFixed(2)} MB\``;
// }


function botInfo() {
   const memory = process.memoryUsage();
   return "=== BOT INFO ===\n\n" +
      "* *Bot Name*: `" + "BiVi" + "`\n" +
      "* *Version*: `" + version_info() + "`\n" +
      "* *Last Version*: `" + version_info() + "`\n" +
      "* *Latest Version Fix*: `" + fixed() + "`\n" +
      "* *Bot Edition*: `" + "AIO [All In One] Edition" + "`\n" +
      "* *Development Phase*: `" + "20-06-2026 to 10-06-2026" + "`\n" +
      "* *Testing Phase*: `" + "10-06-2026 to Present" + "`\n" +
      "* *Updation Status*: `" + "In Progress" + "`\n" +
      "* *Discontinued*: `" + "False" + "`\n\n" +
      "=== TECHNICAL INFO ===\n\n" +
      "* *Process ID*: `" + process.pid + "`\n" +
      "* *Node.js Version*: `" + process.version + "`\n" +
      "* *Platform*: `" + process.platform + "`\n" +
      "* *Architecture*: `" + process.arch + "`\n" +
      "* *BiVi Bot Uptime*: `" + (process.uptime() / 3600).toFixed(2) + " Hours`\n" +
      "* *Working Directory*:\n`Hidden`"
}

function mem() {
   const memory = process.memoryUsage();
   return "=== MEMORY USAGE ===\n\n" +
      "* *RSS*: `" + (memory.rss / 1024 / 1024).toFixed(2) + " MB`\n" +
      "* *Heap Total*: `" + (memory.heapTotal / 1024 / 1024).toFixed(2) + " MB`\n" +
      "* *Heap Used*: `" + (memory.heapUsed / 1024 / 1024).toFixed(2) + " MB`\n" +
      "* *External*: `" + (memory.external / 1024 / 1024).toFixed(2) + " MB`\n" +
      "* *Array Buffers*: `" + (memory.arrayBuffers / 1024 / 1024).toFixed(2) + " MB`";

}

function errmsg(error) {
   return (`Error \`${error.status}\` of \`${error.name}\` with Code \`${error.code}\`:
**Reason:**
> ${error.message}`)
}

// function help(mess) {
//    return `🙂‍↔️ Hi there ${mess.author?.globalName || mess.author?.username || mess.body?.entry?.[0]?.changes?.[0]?.value?.contacts?.[0]?.profile?.name} 💀✍️🔥,
// Welcome to the HELP Command
// -\`I will Guide you though my every hidden command\`
// -\`Before we Proceed further, please note that all commands are case-insensitive. Hence, you can write either capital or small no problem, However the commands are presented in the CamelCase so that users can perceive it's meaning easily.\`
// > You can write these commands for chatting or can simply write whatever you wish for.

// \`Let's see some commands and it's USAGE\`

// -*\`Date\`* : Returns Current Date.
// -*\`Mood\`*  : Used in Setting the Default Mood of the ChatBot [Custom]
// -*\`UserInfo\`* : Returns the UserInfo including Profile Pic.
// -*\`ServerStatus\` OR \`ServerInfo\`* : Returns the Live Server Details
// -*\`Clear\` OR \`Cls\`* : It is used to Delete Chats under the Specific Channel. By Default it is set to only BiVi's Messages, however you can use \`All\` command for delete whole chats. Write: \`Clear\` to get more of it's details.
// -*\`Bot\` OR \`BotInfo\`* : 
// -*\`Report\`* : Used to Report directly to the Developer [Under-Construction till \`*BiVi v1.2.1 Stable*\`]
// -*\`Image\`* : Used to Create Image. Use Command as: *\`Image:* Prompt_Here\`
// -*\`VerInfo\`* |OR| *\`Version\`*: Used to get the Version Information of the BiVi.
// \`There's Many More!!! Just Type \`Commands\ \`to get all Commands List!\`

// We made the world's first Super Advanced Error Handling System (AEHS) especifically for BiVi Bot released in *\`BiVi Unstable v1.0.7\`*
// However, If you get any error in the Message Generation then write:

// **\`*Force:** Prompt_here\`

// Other Crazie Backup Commands:
// -**\`Image:\`**
// -**\`Story:\`** : [Contains Child Commands, So please write: *\`Story\`* first]

// Want to connect to Developer or want to Report or give Feedback? Email us at: support@bivi.online
// We would be happy to listen from you!

// Message Fetched from Server and Sent in:`
// }


function help(mess) {
   const displayName = mess.author?.globalName || mess.author?.username || mess.body?.entry?.[0]?.changes?.[0]?.value?.contacts?.[0]?.profile?.name || mess.body?.chat?.user?.displayName || mess.body?.chat?.messagePayload?.message?.sender?.displayName || "User";

   return "🙂‍↔️ Hi there " + displayName + " 💀✍️🔥,\n" +
      "Welcome to the HELP Command\n" +
      "- I will Guide you though my every hidden command\n" +
      "- Before we Proceed further, please note that all commands are case-insensitive. Hence, you can write either capital or small no problem, However the commands are presented in the CamelCase so that users can perceive it's meaning easily.\n\n" +
      "> You can write these commands for chatting or can simply write whatever you wish for.\n\n" +
      "Let's see some commands and it's USAGE\n\n" +
      "* `Date`: Returns Current Date.\n" +
      "* `Mood`: Used in Setting the Default Mood of the ChatBot [Custom]\n" +
      "* `UserInfo`: Returns the UserInfo including Profile Pic.\n" +
      "* `ServerStatus` OR `ServerInfo`: Returns the Live Server Details\n" +
      "* `Clear` OR `Cls`: It is used to Delete Chats under the Specific Channel. By Default it is set to only BiVi's Messages, however you can use All command for delete whole chats. Write: Clear to get more of it's details.\n" +
      "* `Bot` OR `BotInfo`\n" +
      "* `Report`: Used to Report directly to the Developer [Under-Construction till *BiVi v1.2.1 Stable*]\n" +
      "* `Image`: Used to Create Image. Use Command as: *Image: Prompt_Here*\n" +
      "* `ownerinfo`: Used to get Server/Space/Group Owner Details.*\n" +
      "* `devinfo`: Used to get ChatBot[BiVi] Developer Details.*\n" +
      "* `VerInfo` |OR| `Version`: Used to get the Version Information of the BiVi.\n\n" +
      "There's Many More!!! Just Type `Commands` to get all Commands List!\n\n" +
      "We made the world's first Super Advanced Error Handling System (AEHS) especifically for BiVi Bot released in *BiVi v1.0.7 Stable*\n" +
      "However, If you get any error in the Message Generation then write:\n\n" +
      "* `Force`: Prompt_here\n\n" +
      "Other Crazie Backup Commands:\n" +
      "* `Image`:\n" +
      "* `Story`: [Contains Child Commands, So please write: *Story* first]\n\n" +
      "Want to connect to Developer or want to Report or give Feedback? Email us at: support@bivi.online\n" +
      "We would be happy to listen from you!\n\n" +
      "Message Fetched from Server and Sent in:";
}



// function commands() {
//    return `-**\`Story\`** : Featured in Few Versions ONLY [Available]
// -**\`Help\`**
// -**\`Date\`**
// -**\`Mood\`** : [Under-Construction]
// -**\`Points\` |OR| \`Points{UserName}\`** : [Under-Construction]
// -**\`UserInfo\`**
// -**\`ServerStatus\`** |OR| **\`ServerInfo\`**
// -**\`Clear\`** |OR| **\`Cls\`** : [Contains Child Commands, So please write: **\`Clear\`** first]
// -**\`ConnectAcc\`** |OR| **\`LinkAcc\`** : [Under-Construction]
// -**\`DisconnectAcc\`** |OR| **\`UnlinkAcc\`** : [Under-Construction]
// -**\`Bot\` |OR| \`BotInfo\`**
// -**\`Report\`** : [Under-Construction]
// -**\`Music\`** : [Under-Construction]
// -**\`Code\`** : [Under-Construction]
// -**\`Image\`** : [Under-Construction]
// -**\`IMGSol\`** : [Under-Construction]
// -**\`Skill-ShowOff\`** : [Under-Construction]
// -**\`MessMeAt -Dis -Whats -Insta -GooMess\`** : [Under-Construction]
// -**\`LanguagSet\`** : [Under-Construction]

// Other Commands:
// -**\`Force:\`**
// -**\`Silent:\`**
// -**\`Image:\`**
// -**\`Story:\`** : [Contains Child Commands, So please write: **\`Story\`** first]


// Version: ${version_info()}

// Message Fetched and Sent in:`
// }

function commands() {
   return "=== COMMANDS LIST ===\n\n" +
      "* `Story`: Featured in Few Versions ONLY [Available]\n" +
      "* `Help`\n" +
      "* `Date*\n" +
      "* `Mood*: _[Under-Construction]_\n" +
      "* `Points |OR| Points{UserName}`: _[Under-Construction]_\n" +
      "* `UserInfo`\n" +
      "* `OwnerInfo`\n" +
      "* `DevInfo`\n" +
      "* `ServerStatus |OR| ServerInfo`\n" +
      "*` Clear |OR| Cls`: _[Contains Child Commands, So please write: `Clear` first]_\n" +
      "* `ConnectAcc |OR| LinkAcc`: _[Under-Construction]_\n" +
      "* `DisconnectAcc |OR| UnlinkAcc`: _[Under-Construction]_\n" +
      "* `Bot |OR| BotInfo`\n" +
      "* `Report`: _[Under-Construction]_\n" +
      "* `Music`: _[Under-Construction]_\n" +
      "* `Code`: _[Under-Construction]_\n" +
      "* `Image`: _[Under-Construction]_\n" +
      "* `IMGSol`: _[Under-Construction]_\n" +
      "* `Skill-ShowOff`: _[Under-Construction]_\n" +
      "* `MessMeAt -Dis -Whats -Insta -GooMess`: _[Under-Construction]_\n" +
      "* `LanguagSet`: _[Under-Construction]_\n\n" +
      "Other Commands:\n" +
      "* *Force:*\n" +
      "* *Silent:*\n" +
      "* *Image:*\n" +
      "* *Story*: `[Contains Child Commands, So please write: *Story* first]`\n\n" +
      "Version: " + version_info() + "\n\n" +
      "Message Fetched and Sent in:";
}



function specialcommands() {
   return "Welcome to Special Commands Usage Info!\n" +
      "These commands will help you create more Improved and Detailed Outlinings!\n\n" +
      "Present Available Special Commands:\n\n" +
      "* `Force`: *Prompt...*\n" +
      "This allows you to Force-fully divert your Input to different AI Models. However, you won't be requiring this because BiVi is equipped with world's first Super Advanced Error Handling System (AEHS) in v1.0.7. It automatically transfers your message to different AI Models ensuring smooth and reliable memory and Result.\n\n" +
      "* `Image`: *Prompt...*\n" +
      "This allows you to Generate Images with the AI Models present to us. Example: Image: Create an Image of an Elephant drinking Alcohol 💀✍️🔥.\n\n" +
      "* `Search`: *Prompt...*\n" +
      "This allows you to fetch data present in the WEB Internet using the Gemini Models. Example: Search: Search and tell me what is the price of Iphone 69 pro max 💀.\n\n" +
      "Note: The *Prompt* will be replaced by your Input.\n\n" +
      "Current BiVi Version: `" + version_info() + "`";
}


function devinfo() {
   return "*=== Developer Details ===*\n\n" + 
   "* *Developer Name*: `Anmol Utkarsh`\n" +
      "* *Developer Role*: `Official Bot Developer` / `Owner`\n" +
      "* *Access Level*: `FULL`\n" +
      "* *Is Bot Owner*: `true`\n\n" +

      "* *Bot Version*: `" + version_info() + "`\n" +
      "* *Runtime*: `Node.js Runtime`\n" +
      "* *Supported Platforms*: `discord, whatsapp, google_chat`\n\n" +

      "* *Can Moderate*: `true`\n" +
      "* *Can Log Messages*: `true`\n" +
      "* *Can Track Users*: `true`\n" +
      "* *Can Handle Multi-Platform*: `true`\n\n" +

      "* *Permission Level*: `ROOT OWNER`\n" +
      "* *Permission Type*: `system_admin`\n" +

      "* *Social Media*: `Private`\n" +
      "* *Words of Developer*: \nThis ChatBot is a Fine Tuned AI Powered ChatBot, and we created this Chatbot with a primary focus on Entertainment and no motive for charging any Money from you guys for using this! Even though this ChatBot is AI Powered but in the Development, only 0.5% of the Development was done using AI.\n\nAlso We are glad to Release a Public Statement that we are on our way to Develop a Public Customisable ChatBot for a Replacement for Discord and other ChatBots like Dyno and Rhythms. Currently we are working on other Projects for Free 24/7 Music Streaming Web Application Server Architecture.\nFor the past few days we were in our way to Setup our Servers, and we are fortunate enough that our Servers can Handle Upto 10000 Concurrent Users in Discord.";

}

function ownerinfo(message) {
   const raw = message?.body?.entry?.[0]?.changes?.[0]?.value;
   const discordOwnerId = message?.guild?.ownerId || "";
   const discordOwner =
      message?.guild?.members?.cache?.get?.(discordOwnerId) || "";

   const whatsappGroup = raw?.messages?.[0]?.context?.group_detail || "";

   const whatsappOwner =
      whatsappGroup?.admin ||
      whatsappGroup?.creator ||
      whatsappGroup?.owner ||
      "Unknown";

   const whatsappGroupName =
      whatsappGroup?.subject || "Unknown";

   const whatsappGroupId =
      whatsappGroup?.id || "Private";

   // Google Chat info (limited ownership visibility)
   const googleMsg =
      message.body?.chat?.messagePayload?.message || "";

   const googleSpace =
      googleMsg?.space || "";

   const googleOwner =
      googleSpace?.spaceOwner ||
      googleMsg?.sender?.displayName ||
      "Unknown";

   const googleSpaceName =
      googleSpace?.displayName ||
      "Unknown";

   const googleSpaceType =
      googleSpace?.spaceType ||
      "Unknown";

   return "*=== Server/Space/Group OWNER DETAILS ===*\n\n" +

      "*=== DISCORD OWNER INFO ===*\n" +
      "* *Owner ID*: `" + (discordOwnerId || "Unknown") + "`\n" +
      "* *Owner Username*: `" + (discordOwner?.user?.username || "Unknown") + "`\n" +
      "* *Owner Global Name*: `" + (discordOwner?.user?.globalName || "Unknown") + "`\n" +
      "* *Owner Bot Flag*: `" + (discordOwner?.user?.bot ?? false) + "`\n\n" +

      "*=== WHATSAPP GROUP OWNER INFO ===*\n" +
      "* *Group Name*: `" + whatsappGroupName + "`\n" +
      "* *Group ID*: `" + whatsappGroupId + "`\n" +
      "* *Owner/Admin*: `" + whatsappOwner + "`\n" +
      "* *Messaging Product*: `" + (raw?.messaging_product || "Unknown") + "`\n\n" +

      "*=== GOOGLE CHAT SPACE OWNER INFO=== *\n" +
      "* *Space Name*: `" + googleSpaceName + "`\n" +
      "* *Space Type*: `" + googleSpaceType + "`\n" +
      "* *Owner/Sender*: `" + googleOwner + "`\n\n" +

      "*=== SYSTEM NOTES ===*\n" +
      "* *Discord Support*: `Full Owner API Available`\n" +
      "* *WhatsApp Support*: `Limited (No true owner API)`\n" +
      "* *Google Chat Support*: `Partial (Workspace dependent)`\n" +
      "* *Data Reliability*: `Best-effort unified extraction`\n";
}

// function bivi(){
//    return "Hi There, BiVi Welcomes you!\nHere are the details for BiVi"
// }


const command = { "hello": hello, "help": help, 'date': date, 'botstatus': botInfo, 'bot': botInfo, 'botinfo': botInfo, 'mood': unfinished, 'points': unfinished, 'userinfo': userInfo, 'serverinfo': serverInfo, 'connectacc': unfinished, 'disconnectacc': unfinished, 'devinfo': devinfo, 'report': unfinished, 'music': unfinished, 'code': unfinished, 'image': unfinished, 'imgsol': unfinished, 'skill-showoff': unfinished, "verinfo": () => version_info(), "version": () => version_info(), "versioninfo": () => version_info(), "commands": () => commands(), "details": botInfo, "developer": unfinished, "specialcommands": specialcommands, "specialcommand": specialcommands, "mem": mem, "bivi": botInfo, 'ownerinfo': ownerinfo}

const commands_arr = ["delete this", "delete", "serverstatus", "server status", "clear", "yes", "no", "cls", "clear", "story", "stories", "exit", "devinfo"]




module.exports = { command, commands_arr, hello, userInfo, serverInfo, botInfo, errmsg, version_info }
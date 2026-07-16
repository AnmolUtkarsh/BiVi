const os = require('os')
const { version, fix, new_info, edition } = require('./config.js')
function version_info() {
   return version[(version.length) - 1];
}
function last_version_info() {
   return version[(version.length) - 2]
}
// function fixed() {
//    return fix;
// }
function date() {
   const a = new Date().toString();
   return a;
}
function unfinished() {
   return "This Section is currently under Construction, We expect to make it before next version releases.\n\n * Version: " + version_info();
}

function verhistory() {
   let text = "";
   for (i of version) {
      text = text + "\n" + i
   }
   return text + "\nWrite `verfix` to see the Version Fixes!";
}

function verfix() {
   text = ""
   for (let i in fix) {
      text = text + i + "\n" + "Fix: \n" + fix[i] + "\n\n"

   }
   return text;
}
// let showReleaseIntro = true;

// After 5.5 hours, switch back automatically
// setTimeout(() => {
//    showReleaseIntro = false;
// }, 20000000); // 5h 33m 20s

// const RELEASE_TIME = new Date("2026-07-03T16:00:00+05:30").getTime();
// const RELEASE_WINDOW = 20000000; // 5h 33m 20s

// function showReleaseIntro() {
//    return Date.now() - RELEASE_TIME < RELEASE_WINDOW;
// }


function hello(mess, name, name1) {
   const intro = mess.body?.entry?.[0]?.changes?.[0]?.value?.messaging_product === "whatsapp"
      ? `🙂‍↔️ Hi there ${name}`
      : `🙂‍↔️ Hi there ${name} aka ${name1}`;



   // if (showReleaseIntro) {


     

   //    // return a;
   // }
   // if (!showReleaseIntro) {
      return intro + " 🦧,\n🦉 I am *BiVi 2.0* and I can do things that you will Love 🦉🤌🏻.\n\n> You can write these commands for getting started or can simply write whatever your mind is cooking. ✍🏻🔥\n* ❓ `Help`, `Commands`, `SpecialCommands`\n* 👤 `UserInfo`, `OwnerInfo`, `BotInfo`, `DevInfo`, `Details`\n* 📦 `VerInfo`, `VerFix`, `VerHistory`\n* 🖥️ `ServerInfo`, `ServerStatus`\n* 🗑️ `Clear`, `Delete` (Use `Delete` by replying to a message)\n* 🌐 `Discord`, `Chats`, `Insta`, `WhatsApp`, `Messenger`\n* 📖 `Story`, `Stories`\n* 📝 `Report`\nThere's many more! Just type `Commands` to get the full commands list!\n\nSpecial Commands: `Image: <prompt>`, `Force: <prompt>`, `Search: <prompt>`!\n🌐 *Website's Servers are Online!*\nVisit Now: *BiVi.Online*\n\n🐞 Report Bugs: `Report`.\n> *BiVi 2.0 Listening to '.' Prefixes in all groups, else Optional in DMs. OR write: `.Hello.` for global scope*.\n\nVersion: " + "`" + version_info() + "`";
   }


// }



// function userInfo(message) {
//    const raw = message.body?.entry?.[0]?.changes?.[0]?.value;

//    const user =
//       raw ||
//       message?.author ||
//       message.body?.chat?.user ||
//       {};

//    const member = raw || message?.member;
//    const guild = raw || message?.guild;

//    const roles = (member?.roles?.cache?.map(role => role.name).join(", ") || "None");

//    const permissions = (member?.permissions?.toArray?.().join(",") || "None");

//    let temp = "";
//    if (raw?.messaging_product === "whatsapp" || message?.commonEventObject?.hostApp === "CHAT") {
//       temp = "\n";
//    } else {
//       temp = "\n\n";
//    }

//    const phoneNumber =
//       raw?.messages?.[0]?.from || "Private";

//    const phoneId =
//       user?.metadata?.phone_number_id || "Private";

//    const space =
//       message.body?.chat?.messagePayload?.message?.space || {};

//    const sender =
//       message.body?.chat?.messagePayload?.message?.sender || {};

//    const contacts = raw?.contacts?.[0] || {};

//    const googleMsg =
//       message.body?.chat?.messagePayload?.message || {};

//    const isDiscord = !!message?.author;
//    const isWhatsApp = raw?.messaging_product === "whatsapp";
//    const isGoogleChat = !!message.body?.chat;

//    return "*=== USER INFO ===*\n\n" +
//       "* *User ID*: `" + (
//          user?.id ||
//          contacts?.user_id?.toString?.() ||
//          user?.name ||
//          "None"
//       ) + "`\n" +
//       "* *Username*: `" + (
//          user?.username ||
//          contacts?.profile?.name ||
//          message.body?.chat?.user?.displayName ||
//          "None"
//       ) + "`\n" +
//       "* *Global Name*: `" + (
//          user?.globalName ||
//          contacts?.profile?.name ||
//          sender?.displayName ||
//          "None"
//       ) + "`\n" +
//       "* *Tag*: `" + (
//          user?.tag ||
//          message.body?.chat?.user?.name ||
//          "None"
//       ) + "`\n" +
//       "* *Bot?*: `" + (
//          user?.bot ?? false
//       ) + "`\n" +
//       "* *Account Created*: `" + (
//          user?.createdAt?.toString?.() ||
//          "N.A"
//       ) + "`" + temp +
//       "* *Phone No.*: `" + phoneNumber + "`" + temp +

//       "* *Phone No. ID*: `" + phoneId + "`" + temp +

//       "* *Email*: `" + (
//          message.body?.chat?.user?.email || "Private"
//       ) + "`" + temp +

//       "* *Nickname*: `" + (
//          member?.nickname || "None"
//       ) + "`\n" +

//       "* *Joined Server/Space*: `" + (
//          googleMsg?.createTime ||
//          member?.joinedAt ||
//          "N.A"
//       ) + "`" + temp +

//       "* *Chat History*: `" + (
//          space?.spaceHistoryState || "History_On"
//       ) + "`" + temp +

//       "* *Space Name*: `" + (
//          guild?.name ||
//          raw?.messages?.[0]?.context?.group_detail?.subject ||
//          message.body?.chat?.messagePayload?.message?.space?.displayName ||
//          message.body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.group_id || "None"
//       ) + "`" + temp +

//       "* *Space Type*: `" + (
//          space?.spaceType ||
//          space?.type ||
//          (isWhatsApp ? "GROUP/DM (WhatsApp)" : "UNKNOWN")
//       ) + "`" + temp +

//       "* *Last Online At*: `" + (
//          space?.lastActiveTime || "N.A"
//       ) + "`" + temp +

//       "* *Roles*: `" + roles + "`" + temp +

//       "* *Permissions*:\n`" + permissions + "`" + temp +

//       "* *Guild Name*: `" + (
//          guild?.name ||
//          raw?.messages?.[0]?.context?.group_detail?.subject ||
//          "None"
//       ) + "`\n" +

//       "* *Guild ID*: `" + (
//          guild?.id ||
//          raw?.messages?.[0]?.context?.group_detail?.id ||
//          "None"
//       ) + "`" + temp +

//       "* *Avatar*:\n" +
//       (
//          typeof message?.author?.displayAvatarURL === "function"
//             ? message.author.displayAvatarURL({ extension: "png", size: 1024 })
//             : contacts?.profile?.avatar_url || sender?.avatarUrl || "`Can't Show`"
//       );
// }



function userInfo(message) {

   let info = "*=== USER INFO ===*\n\n";


   // Discord

   if (message?.author) {

      const user = message.author;
      const member = message.member;
      const guild = message.guild;

      info +=
         `* User ID: \`${user.id}\`
* Username: \`${user.username}\`
* Global Name: \`${user.globalName || "None"}\`
* Tag: \`${user.tag}\`
* Bot?: \`${user.bot}\`
* Account Created: \`${user.createdAt}\`

* Nickname: \`${member?.nickname || "None"}\`
* Joined Server: \`${member?.joinedAt || "N.A"}\`

* Roles:
\`${member?.roles?.cache.map(r => r.name).join(", ") || "None"}\`

* Permissions:
\`${member?.permissions?.toArray().join(", ") || "None"}\`

* Guild Name: \`${guild?.name}\`
* Guild ID: \`${guild?.id}\`

* Avatar:
${user.displayAvatarURL({ extension: "png", size: 1024 })}`;

      return info;
   }




   // WhatsApp

   const value = message?.body?.entry?.[0]?.changes?.[0]?.value;

   if (value?.messaging_product === "whatsapp") {

      const msg = value.messages?.[0] || {};
      const contact = value.contacts?.[0] || {};
      const metadata = value.metadata || {};
      const context = msg.context || {};
      const conversation = value.statuses?.[0]?.conversation || {};

      info +=
         `* Phone Number: \`${msg.from || "N.A"}\`
* Wa ID: \`${contact.wa_id || "N.A"}\`
* Display Name: \`${contact.profile?.name || "N.A"}\`

* Phone Number ID: \`${metadata.phone_number_id || "N.A"}\`
* Business Number: \`${metadata.display_phone_number || "N.A"}\`

* Message ID: \`${msg.id || "N.A"}\`
* Message Type: \`${msg.type || "N.A"}\`
* Timestamp: \`${msg.timestamp || "N.A"}\`

* Context Message ID: \`${context.id || "N.A"}\`
* Forwarded: \`${context.forwarded ?? false}\`
* Frequently Forwarded: \`${context.frequently_forwarded ?? false}\`

* Group ID: \`${msg.group_id || context.group_id || "N.A"}\`
* Group Name: \`${context.group_detail?.subject || "N.A"}\`

* Messaging Product: \`${value.messaging_product}\`

* Conversation ID: \`${conversation.id || "N.A"}\`
* Conversation Origin: \`${conversation.origin?.type || "N.A"}\`
* Expiration: \`${conversation.expiration_timestamp || "N.A"}\``;

      return info;
   }




   // Google Chat

   if (message?.body?.chat) {

      const chat = message.body.chat;
      const msg = chat.messagePayload.message;
      const sender = msg.sender;
      const space = msg.space;

      info +=
         `* User ID: \`${sender.name || "N.A"}\`
* Display Name: \`${sender.displayName || "N.A"}\`
* Email: \`${sender.email || "Private"}\`
* User Type: \`${sender.type || "N.A"}\`
* Anonymous: \`${sender.isAnonymous ?? false}\`

* Avatar: ${sender.avatarUrl || "N.A"}

* Space Name: \`${space.displayName || "N.A"}\`
* Space ID: \`${space.name || "N.A"}\`
* Space Type: \`${space.spaceType || space.type || "N.A"}\`
* History: \`${space.spaceHistoryState || "Not Shared"}\`

* Thread: \`${msg.thread?.name || "N.A"}\`
* Message ID: \`${msg.name || "N.A"}\`
* Created: \`${msg.createTime || "N.A"}\`

* Slash Command: \`${msg.slashCommand?.commandId || "None"}\`
* Host App: \`${chat.hostApp || "CHAT"}\`
* Locale: \`${chat.user?.locale || "N.A"}\`
* Time Zone: \`${chat.user?.timeZone || "N.A"}\``;

      return info;
   }

   return "Unknown platform.";
}


function serverInfo() {
   return "*=== SERVER INFO ===*\n\n" +
      "* *Hostname*: `" + os.hostname() + "`\n" +
      "* *OS*: `" + os.type() + "`\n" +
      "* *Platform*: `" + os.platform() + "`\n" +
      "* *Release*: `" + "6.17.0-1016" + "`\n" +
      "* *Version*: `" + os.version() + "`\n" +
      "* *Architecture*: `" + os.arch() + "`\n" +
      "* *Machine*: `" + os.machine() + "`\n" +
      "* *Parallelism*: `" + os.availableParallelism() + "`\n" +
      "* *Free RAM*: `" + (os.freemem() / 1024 ** 3).toFixed(2) + " GB`\n" +
      "* *System Uptime*: `" + (os.uptime() / 3600).toFixed(2) + " Hours`;\n" +
      "* *CDN Server Provider*: `Cloudflare`;\n" +
      "* *Global Server Provider*: `ORACLE` and `Render`;\n" +
      "* *Global Server Status*: `UnFetched`;\n\n" +
      "Note: Server status information is collected using external servers.\n\n" +
      "*=== SERVER LOAD DETAILS ===*\n\n" +
      "* *1s Capacity*: `" + "10520 Con-Current Users" + "`\n" +
      "* *Total BandWidth*: `" + "100TB" + "`\n\n" +
      // "* *Total BandWidth*: `" + "100TB" + "`\n" +
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
      "* *Last Version*: `" + last_version_info() + "`\n" +
      // "* *Latest Version Fix*: `" + fixed() + "`\n" +
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
      "* *Working Directory*:\n`Hidden`\n" + "If you want to know about the current version please write `verinfo`\n Or if you want to see the Version History, please write `verhistory`."
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
      "Welcome in HELP Section\n" +
      "- I will Guide you though my every hidden command\n" +
      "- Before we Proceed further, please note that all commands are case-insensitive. Hence, you can write either capital or small no problem, However the commands are presented in the CamelCase so that users can perceive it's meaning easily.\n\n" +
      "> Commands and it's Uses:\n" +
      "* `Mood`: Set Custom Mood\n" +
      "* `UserInfo`: Returns the UserInfo including Profile Pic.\n" +
      "* `ownerInfo`: Used to get Server/Space/Group Owner Details.*\n" +
      "* `devInfo`: Used to get ChatBot[BiVi] Developer Details.*\n" +
      "* `ServerStatus` OR `ServerInfo`: Returns the Live Server Details\n" +
      "* `Clear` OR `Cls`: \nIn Discord, it is used to Delete Chats under the Specific Channel.\nIn WhatsApp, G-Chats and Instagram, this Clears User's Memory. Write: Clear to get more of it's details.\n" +
      "* `Bot` OR `BotInfo`\n" +
      "* `Report`: Used to Report directly to the Developer\n" +
      "* `VerInfo` OR `Version`: Used to get the Version Information of the BiVi.\n" +
      "* `Story`: [Contains Child Commands, So please write: *Story* first]\n" +
      "* `Image`: Used to Create Image. Use Command as: *Image: Prompt_Here*\n" +
      "* `Search`: Used to Search Content from Internet. Use Command as: *Search: Prompt_Here*\n" +
      "* `Force`: Used If you get any error in the Message Generation then write: `Force`: Prompt_here\n" +
      "There's Many More!!! Just Type `Commands` to get all Commands List!\n\n" +
      "We made the world's first Super Advanced Error Handling System (AEHS) especifically for BiVi Bot released in *BiVi v1.0.7 Stable*\n\n" +
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
      "* `Help`, `UserInfo`, `OwnerInfo`, `DevInfo`\n" +
      "* `Mood` |OR| `Moods`\n" +
      "* `Points |OR| Points{UserName}`: _[Under-Construction]_\n" +
      "* `ServerStatus |OR| ServerInfo`\n" +
      "*` Clear |OR| Cls`: _[Contains Child Commands, So please write: `Clear` first]_\n" +
      "* `ConnectAcc |OR| LinkAcc`: _[Under-Construction]_\n" +
      "* `DisconnectAcc |OR| UnlinkAcc`: _[Under-Construction]_\n" +
      "* `Bot |OR| BotInfo`\n" +
      "* `Report`: _[Under-Construction]_\n" +
      "* `Music`: _[Under-Construction]_\n" +
      "* `Code`: _[Under-Construction]_\n" +
      "* `Image`\n" +
      "* `IMGSol`: _[Under-Construction]_\n" +
      "* `Skill-ShowOff`: _[Under-Construction]_\n" +
      "* `MessMeAt -Dis -Whats -Insta -GooMess`: _[Under-Construction]_\n" +
      "* `Language` |OR| `Lang`\n\n" +
      "Other Commands:\n" +
      "* *Force:*\n" +
      "* *Search:*\n" +
      "* *Image:*\n" +
      "* *Story*: `[Contains Child Commands, So please write: *Story* first]`\n\n" +
      "Version: " + version_info() + "\n\n" +
      "Message Fetched and Sent in:";
}



function specialcommands() {
   return "Welcome in Special Commands Section 🫠🚀!\n" +
      "These commands will help you create more Improved and Detailed Outlinings!\n" +
      "Present Available Special Commands:\n" +
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


function discord() {
   return "Hi there,\nThe Link for BiVi Official Discord ChatBot is:\n\n*_https://discord.com/oauth2/authorize?client_id=1506640389241573396&permissions=7973084880419895&integration_type=0&scope=bot_*"
}
function whatsapp() {
   return "Hi there,\nThe Link for BiVi Official Discord ChatBot is:\n\n*_https://wa.me/917294132087_*"
}
function chats() {
   return "Hi there,\nThe Link for Google Chats BiVi Official ChatBot is:\n\n*_https://discord.com/oauth2/authorize?client_id=1506640389241573396&permissions=7973084880419895&integration_type=0&scope=bot_*"

}
function tac() {
   return "T and C."

}

const command = { "hi": hello, "hello": hello, "help": help, 'date': date, 'botstatus': botInfo, 'bot': botInfo, 'botinfo': botInfo, 'mood': unfinished, 'points': unfinished, 'userinfo': userInfo, 'serverinfo': serverInfo, 'connectacc': unfinished, 'disconnectacc': unfinished, 'devinfo': devinfo, 'report': unfinished, 'music': unfinished, 'code': unfinished, 'image': unfinished, 'imgsol': unfinished, 'skill-showoff': unfinished, "verhistory": () => verhistory(), "versionhistory": () => verhistory(), "verhis": () => verhistory(), "verinfo": () => version_info(), "version": () => version_info(), "versioninfo": () => version_info(), "commands": () => commands(), "details": botInfo, "developer": unfinished, "specialcommands": specialcommands, "specialcommand": specialcommands, "mem": mem, "bivi": botInfo, 'ownerinfo': ownerinfo, 'verfix': () => verfix(), 'versionfix': () => verfix(), "serverstatus": serverInfo, "chats": chats , "terms & conditions" : tac, "discord": discord, "whatsapp":whatsapp, "chats":chats, "gchats":chats}

const commands_arr = ["delete this", "delete", "clear", "cls", "clear", "story", "stories", "devinfo"]




module.exports = { command, commands_arr, hello, userInfo, serverInfo, botInfo, errmsg, version_info }
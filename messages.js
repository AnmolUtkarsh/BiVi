const os = require('os')
const { version } = require('./config.js')
function version_info() {
   return version;
}
function unfinished() {
   return "This Section is currently under Construction, We expect to make it before next version releases.";
}

function hello(mess, name, name1) {
   let intro = "";
   if (mess.body?.entry?.[0]?.changes?.[0]?.value?.messaging_product === "whatsapp") {
      intro = "🙂‍↔️ Hi there " + name;
   }
   else { intro = "🙂‍↔️ Hi there " + name + " aka " + name1 }
   return intro + " 🦧,\nI am *BiVi* and I can do things that you might only imagine 🦉🤌🏻.\n\n🫵🏻 - Felt Bored? Chat here for as long as your wish.\n💻 `Coding or Programming?` Give me the code and in exchange you get the output! [`Code` Command]\n📄 - Want to Compress, Change Format or Make PDF from Images (& vice versa*)? Give me the image/file, I will do that for you! Just Type `IMGSol` to get help `Commands` 📎\n\nYou can also create Images you Imagine! There's Much MORE!\n\n> You can write these commands for getting started or can simply write whatever your mind is cooking. ✍🏻🔥\n\n* `Help`\n* `Date`\n* `Details`\n* `UserInfo` (Requires Acc Linking)\n* `ServerStatus`\n* `Delete` // Use with Referenced Messages\n* `Clear`\n* `OwnDetails`\n* `Report` // Also used to give feedbacks and suggestions\n\nThere's Many More! Just Type `Commands` to get all Commands List!\n\nSpecial Commands: `Force:`, `Image:`, `Search:` // Works on Prompt...\nJust Type `SpecialCommands` to get Special *Commands Usage Help*!\n\nApart from these, Please Type *Help* if wanna get some basic knowledge of BiVi's capabilities!\n\nNOTE: If you Find any BUG 🐞 Please 🙏 REPORT it to us at report@bivi.online\nAll the Server Status are captured using another Servers.\n\nVersion: " + version_info();
}
// -**\`MessMeAt -Dis -Whats -Insta -GooMess\`** (Requires Acc Linking)
// > Exclusive Commands (Only for Developers):
// -**\`Developer\`** => < -\`Comming Soon\` >
function date() {
   const a = new Date().toString();
   return a;
}

function userInfo(message) {
   const user = message.body.entry?.[0]?.changes?.[0]?.value || message?.author;
   const member = message.body.entry?.[0]?.changes?.[0]?.value || message?.member;
   const guild = message.body.entry?.[0]?.changes?.[0]?.value || message?.guild;

   const roles = (member?.roles?.cache?.map(role => role.name).join(", ") || "None");

   const permissions = (member?.permissions?.toArray().join(",") || "None");
   let temp = ""
   if (message.body?.entry?.[0]?.changes?.[0]?.value?.messaging_product === "whatsapp") {
      temp = "\n"
   }
   else {
      temp = "\n\n"
   }
   return "=== USER INFO ===\n\n" +
      "* *User ID*: `" + (user.id || user?.contacts?.[0]?.user_id) + "`\n" +
      "* *Username*: `" + (user.username || user?.contacts?.[0]?.profile?.name) + "`\n" +
      "* *Global Name*: `" + (user.globalName || user?.contacts?.[0]?.profile?.name) + "`\n" +
      "* *Tag*: `" + (user.tag || "None") + "`\n" +
      "* *Bot*: `" + (user.bot || "False") + "`\n" +
      "* *Account Created*: `" + (user.createdAt?.toString() || "N.A for Whatsapp") + "`" + temp +
      "* *Phone No.*: `" + (message?.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.from || "Private") + "`" + temp +
      "* *Phone No. ID*: `" + (user?.metadata?.phone_number_id || "Private") + "`" + temp +
      "* *Nickname*: `" + (member?.nickname || "None") + "`\n" +
      "* *Joined Server*: `" + (member?.joinedAt || "N.A for Whatsapp") + "`" + temp +
      "* *Roles*: `" + roles + "`" + temp +
      "* *Permissions*:\n`" + permissions + "`" + temp +
      "* *Guild Name*: `" + (guild?.name || message?.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.context?.group_detail?.subject || "None") + "`\n" +
      "* *Guild ID*: `" + (guild?.id || guild?.messages?.[0]?.context?.group_detail.id || "None") + "`" + temp +
      "* *Avatar*:\n" + (typeof user?.displayAvatarURL === 'function' ? user.displayAvatarURL({ extension: "png", size: 1024 }) : "`Can't Show`");
}

function serverInfo() {
   return "=== SERVER INFO ===\n\n" +
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
      "* *Chatting Edition*: `" + "AIO (All In One) Edition" + "`\n" +
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
   const displayName = mess.author?.globalName || mess.author?.username || mess.body?.entry?.[0]?.changes?.[0]?.value?.contacts?.[0]?.profile?.name || "User";

   return "🙂‍↔️ Hi there " + displayName + " 💀✍️🔥,\n" +
      "Welcome to the HELP Command\n" +
      "- `I will Guide you though my every hidden command`\n" +
      "- `Before we Proceed further, please note that all commands are case-insensitive. Hence, you can write either capital or small no problem, However the commands are presented in the CamelCase so that users can perceive it's meaning easily.`\n\n" +
      "> You can write these commands for chatting or can simply write whatever you wish for.\n\n" +
      "`Let's see some commands and it's USAGE`\n\n" +
      "* *Date*: `Returns Current Date.`\n" +
      "* *Mood*: `Used in Setting the Default Mood of the ChatBot [Custom]`\n" +
      "* *UserInfo*: `Returns the UserInfo including Profile Pic.`\n" +
      "* *ServerStatus OR ServerInfo*: `Returns the Live Server Details`\n" +
      "* *Clear OR Cls*: `It is used to Delete Chats under the Specific Channel. By Default it is set to only BiVi's Messages, however you can use All command for delete whole chats. Write: Clear to get more of it's details.`\n" +
      "* *Bot OR BotInfo*:\n" +
      "* *Report*: `Used to Report directly to the Developer [Under-Construction till *BiVi v1.2.1 Stable*]`\n" +
      "* *Image*: `Used to Create Image. Use Command as: *Image: Prompt_Here``\n" +
      "* *VerInfo |OR| Version*: `Used to get the Version Information of the BiVi.`\n\n" +
      "`There's Many More!!! Just Type \`Commands\` to get all Commands List!`\n\n" +
      "We made the world's first Super Advanced Error Handling System (AEHS) especifically for BiVi Bot released in *BiVi Unstable v1.0.7*\n" +
      "However, If you get any error in the Message Generation then write:\n\n" +
      "* *Force*: `Prompt_here`\n\n" +
      "Other Crazie Backup Commands:\n" +
      "* *Image:*\n" +
      "* *Story*: `[Contains Child Commands, So please write: *Story* first]`\n\n" +
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



// function SpecialCommands() {
//    return `Welcome to Special Commands Usage Info!
//    These commands will help you create more Improved and Detailed Outlinings!

//    Present Avaiable Special Commands:

//       -**\`Force:\`** Prompt...
//          This allows you to Force-fully divert your Input to different AI Models. However, you won't be requiring this because BiVi is equiped with world's first Super Advanced Error Handling System (AEHS) in v1.0.7. It automatically transfers your message to different AI Models ensuring smooth and reliable memory and Result

//       -**\`Image:\`** Prompt...
//          This allows you to Generate Images with the AI Models present to us. Example: Image: Create an Image of an Elephant drinking Alcohol 💀✍️🔥.

//       -**\`Search:\`** prompt...
//          This allows you to fetch data present in the WEB Internet using the Gemini Models. Example: Search: Search and tell me what is the price of Iphone 69 pro max 💀.

//       Note: The *Prompt* will be replaced by your Input.

//       Current BiVi Version: ${version_info()}`
// }



function specialcommands() {
   return "Welcome to Special Commands Usage Info!\n" +
      "These commands will help you create more Improved and Detailed Outlinings!\n\n" +
      "Present Available Special Commands:\n\n" +
      "* *Force*: `Prompt...`\n" +
      "This allows you to Force-fully divert your Input to different AI Models. However, you won't be requiring this because BiVi is equipped with world's first Super Advanced Error Handling System (AEHS) in v1.0.7. It automatically transfers your message to different AI Models ensuring smooth and reliable memory and Result.\n\n" +
      "* *Image*: `Prompt...`\n" +
      "This allows you to Generate Images with the AI Models present to us. Example: Image: Create an Image of an Elephant drinking Alcohol 💀✍️🔥.\n\n" +
      "* *Search*: `Prompt...`\n" +
      "This allows you to fetch data present in the WEB Internet using the Gemini Models. Example: Search: Search and tell me what is the price of Iphone 69 pro max 💀.\n\n" +
      "Note: The *Prompt* will be replaced by your Input.\n\n" +
      "Current BiVi Version: " + version_info();
}

// function bivi(){
//    return "Hi There, BiVi Welcomes you!\nHere are the details for BiVi"
// }


const command = { "hello": hello, "help": help, 'date': date, 'botstatus': botInfo, 'bot': botInfo, 'botinfo': botInfo, 'mood': unfinished, 'points': unfinished, 'userinfo': userInfo, 'serverinfo': serverInfo, 'connectacc': unfinished, 'disconnectacc': unfinished, 'owndetails': unfinished, 'report': unfinished, 'music': unfinished, 'code': unfinished, 'image': unfinished, 'imgsol': unfinished, 'skill-showoff': unfinished, "verinfo": () => version_info(), "version": () => version_info(), "versioninfo": () => version_info(), "commands": () => commands(), "details": botInfo, "developer": unfinished, "specialcommands": specialcommands , "mem" : mem, "bivi" : botInfo}

const commands_arr = ["delete this", "delete", "serverstatus", "server status", "clear", "yes", "no", "cls", "clear", "story", "stories", "exit", "1"]




module.exports = { command, commands_arr, hello, userInfo, serverInfo, botInfo, errmsg, version_info }
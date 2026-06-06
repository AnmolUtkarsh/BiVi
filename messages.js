const os = require('os')
const {version} = require('./config.js')
function version_info(){
   return version;
}
function unfinished() {
   return "This Section is currently under Construction, We expect to make it before next version releases.";
}

function hello(name, name1) {
   return `🙂‍↔️ Hi there ${name} aka ${name1} :orangutan:,
I am **BiVi** and I can do things that you might only imagine :owl::pinched_fingers:.
:index_pointing_at_the_viewer: -Felt Bored? Chat here for as long as your wish.
:computer: \`-Coding or Programming?\` Give me the code and in exchange you get the output! [\`Code\` Command]
:page_facing_up: -Want to Compress, Change Format or Make PDF from Images(& vice versa*)? Give me the image/file, I will do that for you! Just Type \`IMGSol\` to get help \`Commands\` :paperclip:

:helmet_with_cross: You may talk dirty to me if you are horny. :bikini:🫦
You can also create Images you Imagine!
There's Much MORE!

> You can write these commands for getting started or can simply write whatever you're mind is cooking. ✍🏻🔥
-**\`Help\`**
-**\`Date\`**
-**\`Details\`**
-**\`UserInfo\`** (Requires Acc Linking)
-**\`ServerStatus\`**
-**\`Delete\`** //Use with Referenced Messages
-**\`Clear\`**
-**\`OwnDetails\`**
-**\`Report\`** //Also used to give feedbacks and suggestions**
There's Many More! Just Type \`Commands\` to get all Commands List!

Special Commands: **\`Force:\`**, **\`Image:\`**, **\`Search:\`** // Works on Prompt...
Just Type \`SpecialCommands\` to get Special *Commands Usage Help*!

Apart from these, Please Type **"Help"** if wanna get some basic knowledge of BiVi's capabilities!

NOTE: If you Find any BUG :lady_beetle: Please :pray: REPORT it to us at report@bivi.online
All the Server Status are captured using another Servers.

Version: ${version_info}`
}

// -**\`MessMeAt -Dis -Whats -Insta -GooMess\`** (Requires Acc Linking)
// > Exclusive Commands (Only for Developers):
// -**\`Developer\`** => < -\`Comming Soon\` >
function date() {
   const a = new Date().toString();
   return a;
   }

   function userInfo(message) {
   const user = message.author;
   const member = message.member;
   const guild = message.guild;
   
   const roles = member.roles.cache
   .map(role => role.name)
   .join(", ");
   
   const permissions = member.permissions
   .toArray()
   .join(",");

   return `
=== USER INFO ===

-**User ID**: \`${user.id}\`
-**Username**: \`${user.username}\`
-**Global Name**: \`${user.globalName || "None"}\`
-**Tag**: \`${user.tag}\`
-**Bot**: \`${user.bot}\`
-**Account Created**: \`${user.createdAt}\`

-**Nickname**: \`${member.nickname || "None"}\`
-**Joined Server**: \`${member.joinedAt}\`

-**Roles**: \`${roles}\`

-**Permissions**:
\`${permissions}\`

-**Guild Name**: \`${guild.name}\`
-**Guild ID**: \`${guild.id}\`

-**Avatar**:
${user.displayAvatarURL({ extension: "png", size: 1024 })}
`;
}

function serverInfo() {
    return `
=== SERVER INFO ===

-**Hostname**: \`${os.hostname()}\`
-**OS**: \`${os.type()}\`
-**Platform**: \`${os.platform()}\`
-**Release**: \`${os.release()}\`
-**Version**: \`${os.version()}\`
-**Architecture**: \`${os.arch()}\`
-**Machine**: \`${os.machine()}\`
-**CPU Model**: \`${os.cpus()[0].model}\`
-**CPU Cores**: \`${os.cpus().length}\`
-**Parallelism**: \`${os.availableParallelism()}\`
-**Total RAM**: \`${(os.totalmem()/1024**3).toFixed(2)} GB\`
-**Free RAM**: \`${(os.freemem()/1024**3).toFixed(2)} GB\`
-**Used RAM**: \`${((os.totalmem()-os.freemem())/1024**3).toFixed(2)} GB\`
-**System Uptime**: \`${(os.uptime()/3600).toFixed(2)} Hours\`;
-**CDN Server Provider**: \`Cloudflare\`;

Details Fetched in:`
}

function botInfo() {
    const memory = process.memoryUsage();
    return `
=== BOT INFO ===

-**Process ID**: \`${process.pid}\`
-**Node.js Version**: \`${process.version}\`
-**Platform**: \`${process.platform}\`
-**Architecture**: \`${process.arch}\`
-**BiVi Bot Uptime**: \`${(process.uptime() / 3600).toFixed(2)} Hours\`
-**Working Directory**:\`
\`${"Hidden"}\`

=== MEMORY USAGE ===

-**RSS**: \`${(memory.rss / 1024 / 1024).toFixed(2)} MB\`
-**Heap Total**: \`${(memory.heapTotal / 1024 / 1024).toFixed(2)} MB\`
-**Heap Used**: \`${(memory.heapUsed / 1024 / 1024).toFixed(2)} MB\`
-**External**: \`${(memory.external / 1024 / 1024).toFixed(2)} MB\`
-**Array Buffers**: \`${(memory.arrayBuffers / 1024 / 1024).toFixed(2)} MB\``;
}


function errmsg(error){
   return (`Error \`${error.status}\` of \`${error.name}\` with Code \`${error.code}\`:
**Reason:**
> ${error.message}`)
}

function help(){
   return `🙂‍↔️ Hi there ${name} ^_~,
Welcome to the HELP Command
-\`I will Guide you though my every hidden command\`
-\`Before we Proceed further, please note that all commands are case-insensitive. Hence, you can write either capital or small no problem, However the commands are presented in the CamelCase so that users can perceive it's meaning easily.\`
> You can write these commands for chatting or can simply write whatever you wish for.

\`Let's see some commands and it's USAGE\`

-*\`Date\`* : Returns Current Date.
-*\`Mood\`*  : Used in Setting the Default Mood of the ChatBot [Custom]
-*\`UserInfo\`* : Returns the UserInfo including Profile Pic.
-*\`ServerStatus\` OR \`ServerInfo\`* : Returns the Live Server Details
-*\`Clear\` OR \`Cls\`* : It is used to Delete Chats under the Specific Channel. By Default it is set to only BiVi's Messages, however you can use \`All\` command for delete whole chats. Write: \`Clear\` to get more of it's details.
-*\`Bot\` OR \`BotInfo\`* : 
-*\`Report\`* : Used to Report directly to the Developer [Under-Construction till \`*BiVi v1.2.1 Stable*\`]
-*\`Image\`* : Used to Create Image. Use Command as: *\`Image:* Prompt_Here\`
-*\`VerInfo\`* |OR| *\`Version\`*: Used to get the Version Information of the BiVi.
\`There's Many More!!! Just Type \`Commands\ \`to get all Commands List!\`

We made the world's first Super Advanced Error Handling System (AEHS) especifically for BiVi Bot released in *\`BiVi Unstable v1.0.7\`*
However, If you get any error in the Message Generation then write:

**\`*Force:** Prompt_here\`

Other Crazie Backup Commands:
-**\`Image:\`**
-**\`Story:\`** : [Contains Child Commands, So please write: *\`Story\`* first]

Want to connect to Developer or want to Report or give Feedback? Email us at: support@bivi.online
We would be happy to listen from you!

Message Fetched from Server and Sent in:`
}

function commands(){
   return `-**\`Story\`** : Featured in Few Versions ONLY [Available]
-**\`Help\`**
-**\`Date\`**
-**\`Mood\`** : [Under-Construction]
-**\`Points\` |OR| \`Points{UserName}\`** : [Under-Construction]
-**\`UserInfo\`**
-**\`ServerStatus\`** |OR| **\`ServerInfo\`**
-**\`Clear\`** |OR| **\`Cls\`** : [Contains Child Commands, So please write: **\`Clear\`** first]
-**\`ConnectAcc\`** |OR| **\`LinkAcc\`** : [Under-Construction]
-**\`DisconnectAcc\`** |OR| **\`UnlinkAcc\`** : [Under-Construction]
-**\`Bot\` |OR| \`BotInfo\`**
-**\`Report\`** : [Under-Construction]
-**\`Music\`** : [Under-Construction]
-**\`Code\`** : [Under-Construction]
-**\`Image\`** : [Under-Construction]
-**\`IMGSol\`** : [Under-Construction]
-**\`Skill-ShowOff\`** : [Under-Construction]
-**\`MessMeAt -Dis -Whats -Insta -GooMess\`** : [Under-Construction]
-**\`LanguagSet\`** : [Under-Construction]

Other Commands:
-**\`Force:\`**
-**\`Silent:\`**
-**\`Image:\`**
-**\`Story:\`** : [Contains Child Commands, So please write: **\`Story\`** first]


Version: ${version_info}

Message Fetched and Sent in:`
}

function SpecialCommands(){
   return `Welcome to Special Commands Usage Info!
   These commands will help you create more Improved and Detailed Outlinings!
   
   Present Avaiable Special Commands:

      -**\`Force:\`** Prompt...
         This allows you to Force-fully divert your Input to different AI Models. However, you won't be requiring this because BiVi is equiped with world's first Super Advanced Error Handling System (AEHS) in v1.0.7. It automatically transfers your message to different AI Models ensuring smooth and reliable memory and Result

      -**\`Image:\`** Prompt...
         This allows you to Generate Images with the AI Models present to us. Example: Image: Create an Image of an Elephant drinking Alcohol 💀✍️🔥.

      -**\`Search:\`** prompt...
         This allows you to fetch data present in the WEB Internet using the Gemini Models. Example: Search: Search and tell me what is the price of Iphone 69 pro max 💀.
      
      Note: The *Prompt* will be replaced by your Input.

      Current BiVi Version: ${version_info}`
}

const command = { "hello": hello, "help": help, 'date': date, 'botstatus': botInfo, 'bot': botInfo,'botinfo': botInfo, 'mood': unfinished, 'points': unfinished, 'userinfo': userInfo, 'serverinfo': serverInfo, 'connectacc': unfinished, 'disconnectacc': unfinished, 'owndetails': unfinished, 'report': unfinished, 'music': unfinished, 'code': unfinished, 'image': unfinished, 'imgsol': unfinished, 'skill-showoff': unfinished, "verinfo": () => version_info(), "version": () => version_info(),"versioninfo": () => version_info(), "commands": () => commands(), "details" : botInfo, "developer": unfinished, "specialcommands": SpecialCommands}

const commands_arr= ["delete this", "delete", "serverstatus", "server status", "clear", "yes","no", "cls", "clear", "story", "stories", "exit", "1"]




module.exports = {command, commands_arr, hello, userInfo , serverInfo, botInfo, errmsg, version_info}
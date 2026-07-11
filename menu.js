const { version_info } = require("./messages");

// async function buildInteractiveMessage(platform, options) {

// }
























// function whatsappMenu(to, menu) {

//     return {
//         messaging_product: "whatsapp",
//         recipient_type: "individual",
//         to,

//         type: "interactive",

//         interactive: {
//             type: "list",

//             header: {
//                 type: "text",
//                 text: "👋 Welcome to BiVi"
//             },

//             body: {
//                 text:
//                     "Hi!\n\nI'm BiVi.\nWhat would you like to do today?"
//             },

//             footer: {
//                 text: "BiVi • Multi-platform AI Assistant"
//             },

//             action: {
//                 button: "Open Menu",

//                 sections: menu.map(section => ({
//                     title: section.title,

//                     rows: section.rows.map(row => ({
//                         id: row.id,
//                         title: row.title,
//                         description: row.description
//                     }))
//                 }))
//             }
//         }
//     };

// }


// function googleChatMenu(menu) {

//     return {
//         cardsV2: [
//             {
//                 cardId: "bivi_menu",

//                 card: {

//                     header: {
//                         title: "👋 Welcome to BiVi",
//                         subtitle: "Multi-platform AI Assistant"
//                     },

//                     sections: menu.map(section => ({

//                         header: section.title,

//                         widgets: section.rows.map(row => ({

//                             buttonList: {
//                                 buttons: [
//                                     {
//                                         text: row.title,

//                                         onClick: {
//                                             action: {
//                                                 actionMethodName: row.id
//                                             }
//                                         }
//                                     }
//                                 ]
//                             }

//                         }))

//                     }))

//                 }
//             }
//         ]
//     };

// }


// function discordMenu(menu) {

//     let msg = "## 👋 Welcome to BiVi\n\n";

//     for (const section of menu) {

//         msg += `### ${section.title}\n`;

//         for (const row of section.rows) {

//             msg += `• **${row.title}**\n`;
//             msg += `${row.description}\n\n`;

//         }

//     }

//     return msg;

// }


// const payload = buildInteractiveMessage("whatsapp", {
//     to: recipientId,
//     menu,
//     title: "👋 Welcome to BiVi",
//     body: "Hi!\n\nI'm BiVi.\nWhat would you like to do today?",
//     footer: "BiVi • Multi-platform AI Assistant",
//     button: "Open Menu"
// });
// const payload = buildInteractiveMessage("google", {
//     menu,
//     title: "👋 Welcome to BiVi",
//     subtitle: "Multi-platform AI Assistant"
// });


// const text = buildInteractiveMessage("discord", {
//     menu
// });
// await fetch(
//     `https://graph.facebook.com/v25.0/${process.env.phone_number_id}/messages`,
//     {
//         method: "POST",
//         headers: {
//             Authorization: `Bearer ${process.env.whatsapp_api_test}`,
//             "Content-Type": "application/json"
//         },
//         body: JSON.stringify(payload)
//     }
// );

// const menu = {
//     title: "👋 Welcome to BiVi",

//     subtitle: "Multi-platform AI Assistant",

//     body:
//         "Hi! I'm BiVi.\n\nWhat would you like to do today?",

//     footer:
//         "BiVi • Your All-in-One Assistant",

//     button:
//         "Open Menu",

//     sections: [
//         {
//             title: "🤖 AI Features",

//             rows: [
//                 {
//                     id: "chat",
//                     title: "Chat with BiVi",
//                     description: "Talk with AI"
//                 },

//                 {
//                     id: "image",
//                     title: "Generate Image",
//                     description: "Create AI images"
//                 }
//             ]
//         },

//         {
//             title: "⚙️ Utilities",

//             rows: [
//                 {
//                     id: "userinfo",
//                     title: "User Info",
//                     description: "View your profile"
//                 },

//                 {
//                     id: "serverinfo",
//                     title: "Server / Group Info",
//                     description: "Current chat information"
//                 },

//                 {
//                     id: "help",
//                     title: "Help",
//                     description: "View all commands"
//                 }
//             ]
//         }, {
//             title: "⚙️ Version",

//             rows: [
//                 {
//                     id: "userinfo",
//                     title: "User Info",
//                     description: "View your profile"
//                 },

//                 {
//                     id: "serverinfo",
//                     title: "Server / Group Info",
//                     description: "Current chat information"
//                 },

//                 {
//                     id: "help",
//                     title: "Help",
//                     description: "View all commands"
//                 }
//             ]
//         }
//     ]
// };























const WhatsAppmenu = {
    title: "Introducing BiVi 2.0.0 LTS Edition!",
    subtitle: "👋 Welcome to BiVi 2.0.0 LTS",
    body: " 🦧,\n👋 Welcome to BiVi 2.0.0 LTS\n\n🦉 I am *BiVi 2.0* and I can do things that you will Love 🦉🤌🏻.\n\n🫵🏻 - Felt Bored? Chat here for as long as your wish or Create Images!\nChoose an option below to get started. or can simply write whatever your mind is cooking. ✍🏻🔥\n\nATTENTION: From BiVi 2.0.0 LTS, BiVi is only listening to '.' Commands. Example: `.Hello` or `.Image:....`. But you can get into Group Mode to change this. In Servers/Groups, this commands is OPTIONAL!\nType these:\n* 🌐 `Discord`, `Chats`, `Instagram`, `WhatsApp`, `Messenger`\n* BiVi.online servers are Online!, Checkout Terms & Condition here: https://bivi.online/terms-and-conditions.\n\nDue to WhatsApp Template Limit, we are only to show 10 Top Commands in the Button Below. Please write: `.Hello.` to get all the commands!",
    footer: "BiVi™ • bivi.online • "+ version_info() + " • Listening to '.' Prefixes",
    button: "BiVi Commands",

    sections: [
        {
            title: "🚀 Getting Started",
            rows: [
                {
                    id: ".help",
                    title: ".Help",
                    description: "Getting Started Guide"
                },
                {
                    id: ".commands",
                    title: ".Commands",
                    description: "View all available commands."
                },
                {
                    id: ".specialcommands",
                    title: ".SpecialCommands",
                    description: "View all Special commands."
                }

            ]
        },



        {
            title: "👤 Information",
            rows: [
                {
                    id: ".userinfo",
                    title: ".UserInfo",
                    description: "Your profile details"
                },
                {
                    id: ".botinfo",
                    title: ".BotInfo",
                    description: "About BiVi"
                },
                {
                    id: ".ownerinfo",
                    title: ".OwnerInfo",
                    description: "About Server/Space Owner"
                },
                {
                    id: ".devinfo",
                    title: ".DevInfo",
                    description: "About BiVi Developer"
                }
            ]
        },
        {
            title: "✨ Modes",
            rows: [
                {
                    id: ".modes",
                    title: ".Modes",
                    description: "All Latest Modes"
                },
            ]
        },
        {
            title: "⌚ History",
            rows: [
                {
                    id: ".history",
                    title: ".History",
                    description: "Control and see Chats History"
                },
            ]
        },
        {
            title: "🖥️ Server | 📦 Version",
            rows: [
                {
                    id: ".serverinfo",
                    title: ".ServerInfo",
                    description: "VPS Server Instance Info"
                },
                {
                    id: ".version",
                    title: ".Version",
                    description: "Current Version details"
                },
                {
                    id: ".verhis",
                    title: ".VerHis",
                    description: "All Versions History"
                }
            ]
        },

        

        {
            title: "🐞 Support",
            rows: [
                {
                    id: "report",
                    title: "Report:<prompt>",
                    description: "Report an issue"
                },
                
            ]
        }
    ]
};


const googleChatMenu = {
    title: "Introducing BiVi 2.0.0 LTS Edition!",
    subtitle: "👋 Welcome to BiVi 2.0.0 LTS",
    body: " 🦧,\n👋 Welcome to BiVi 2.0.0 LTS\n\n🦉 I am *BiVi 2.0* and I can do things that you will Love 🦉🤌🏻.\n\n🫵🏻 - Felt Bored? Chat here for as long as your wish or Create Images!\nChoose an option below to get started. or can simply write whatever your mind is cooking. ✍🏻🔥\n\nATTENTION: From BiVi 2.0.0 LTS, BiVi is only listening to '.' Commands. Example: `.Hello` or `.Image:....`. But you can get into Group Mode to change this. In Servers/Groups, this command is OPTIONAL!\nType these:\n* 🌐 `Discord`, `Chats`, `Instagram`, `WhatsApp`, `Messenger`\n",

    footer: "BiVi™ • bivi.online • "+ version_info() + " • Listening to '.' Commands",

    sections: [
        {
            title: "🚀 Getting Started",
            rows: [
                {
                    id: ".help",
                    title: ".Help",
                    description: "Getting Started Guide"
                },
                {
                    id: ".commands",
                    title: ".Commands",
                    description: "View all available commands."
                },
                {
                    id: ".specialcommands",
                    title: ".SpecialCommands",
                    description: "View all Special commands."
                }
            ]
        },
        {
            title: "✨ Special Commands", rows:
                [
                    {
                        id: ".image: generate image of an elephant",
                        title: ".Image:<prompt>",
                        description: "Generate AI images from a prompt."

                    },
                    {
                        id: ".search: Latest News in India",
                        title: ".Search:<prompt>",
                        description: "Search the web using AI."

                    },
                    {
                        id: ".force: Are you Working?",
                        title: ".Force:<prompt>",
                        description: "Force an AI response (backup mode)."

                    },
                    {
                        id: ".story",
                        title: ".Story",
                        description: "Listen to Stories."

                    }

                ]
        },

        {
            title: "👤 Information",
            rows: [
                {
                    id: ".userinfo",
                    title: ".UserInfo",
                    description: "Your profile details"
                },
                {
                    id: ".botinfo",
                    title: ".BotInfo",
                    description: "About BiVi"
                },
                {
                    id: ".ownerinfo",
                    title: ".OwnerInfo",
                    description: "About Server/Space Owner"
                },
                {
                    id: ".devinfo",
                    title: ".DevInfo",
                    description: "About BiVi Developer"
                }
            ]
        },

        {
            title: "✨ Modes",
            rows: [
                {
                    id: ".modes",
                    title: ".Modes",
                    description: "All Latest Modes"
                },
                {
                    id: ".groupmode",
                    title: ".Mode:Group",
                    description: "Enters into Group Mode where '.' Prefix is not compulsory."
                },
                {
                    id: ".groupallmode",
                    title: ".Mode:GroupAll",
                    description: "Only for Groups. Enables Group Mode for everyone."
                }
            ]
        },

        {
            title: "⌚ History",
            rows: [
                {
                    id: ".history",
                    title: ".History",
                    description: "Control and see Chats History"
                },
                {
                    id: ".history:on",
                    title: ".History:Off",
                    description: "Temporarily disable chat history."
                },
                {
                    id: ".history:off",
                    title: ".History:Off",
                    description: "Temporarily disable chat history."
                }
            ]
        },

        {
            title: "🖥️ Server | 📦 Version",
            rows: [
                {
                    id: ".serverinfo",
                    title: ".ServerInfo",
                    description: "VPS Server Instance Info"
                },
                {
                    id: ".version",
                    title: ".Version",
                    description: "Current Version details"
                },
                {
                    id: ".verhis",
                    title: ".VerHis",
                    description: "All Versions History"
                }
            ]
        },

        {
            title: "🌐 Platforms",
            rows: [
                {
                    id: ".discord",
                    title: ".Discord",
                    description: "Discord server link"
                },
                {
                    id: ".chats",
                    title: ".Google Chats",
                    description: "Google Chat link"
                },
                {
                    id: ".instagram",
                    title: ".Instagram",
                    description: "Under testing"
                }
            ]
        },

        {
            title: "🐞 Support",
            rows: [
                {
                    id: ".report",
                    title: "Report:<prompt>",
                    description: "Report an issue"
                },
                {
                    id: "terms & conditions",
                    title: "Terms & Conditions",
                    description: "Or Visit https://bivi.online/terms-and-conditions."
                }
            ]
        }
    ]
};
module.exports = {WhatsAppmenu, googleChatMenu}
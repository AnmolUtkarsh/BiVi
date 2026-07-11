const { getEncoding } = require('js-tiktoken');
const Groq = require('groq-sdk');
const { BiVi, BiVi_Force_Reply } = require('./api');
require('dotenv').config()
const { bivi_image } = require('./api.js');
const { WhatsAppmenu, googleChatMenu } = require('./menu.js');


function filt(value) {
    return (value.toString()).toLowerCase().trim();
}



















async function indi_image_send(mess) {

    let imageUrl;

    try {
        imageUrl = await bivi_image(mess);
    }
    catch (error) {
        return await reply(mess, "Error in Processing the Image due to Temporary Heavy Loads for Now.\nIf this Happens Frequently, report to report@bivi.online or simply write: `Report:` _<issues>_\nPlease Try Again Later :(")
    }

    if (!imageUrl) return;
    const isGoogleChat =
        !!mess.body?.chat ||
        !!mess.body?.space ||
        !!mess.body?.commonEventObject;

    if (isGoogleChat) {
        // Later you can replace this with cards/widgets
        return {
            hostAppDataAction: {
                chatDataAction: {
                    createMessageAction: {
                        message: {
                            text: imageUrl
                        }
                    }
                }
            }
        };
    }





    if (mess.channel?.send) {
        try {
            return await mess.channel.send({
                files: [imageUrl]
            });
        } catch (error) {
            console.log("Error in Sending Discord Image!");
        }
    }





    if (mess.body?.entry?.[0]?.changes?.[0]?.value?.messaging_product === "whatsapp") {
        const recipientId = mess.body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.from;
        const incomingMessageId = mess.body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.id;

        if (!recipientId) {
            console.log("Webhook received, but it's a status update (delivered/read), not an incoming message.");
            return;
        }
        try {
            const response = await fetch(
                `https://graph.facebook.com/v25.0/${process.env.phone_number_id}/messages`,
                {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${process.env.whatsapp_api_test}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        messaging_product: "whatsapp",
                        to: recipientId,
                        type: "image",
                        image: {
                            link: imageUrl
                        }
                    })
                }
            );

            const data = await response.json();
            if (!response.ok) {
                console.log("WhatsApp API Error Response:", data);
            } else {
                console.log("Message sent successfully:", data.messages?.[0]?.id);
            }
        } catch (err) {
            console.log("Failed to execute fetch to Meta API:", err);
        }
    }
}



























async function indi_reply(mess, value) {
    // const valueObj = mess.body?.entry?.[0]?.changes?.[0]?.value || mess.body?.commonEventObject?.hostApp;
    // const valueObj = mess.body?.entry?.[0]?.changes?.[0]?.value || (isGoogleChat ? "CHAT" : null);
    const isGoogleChat =
        !!mess.body?.chat ||
        !!mess.body?.space ||
        !!mess.body?.commonEventObject;

    if (isGoogleChat) {
        return {
            hostAppDataAction: {
                chatDataAction: {
                    createMessageAction: {
                        message: {
                            text: value
                        }
                    }
                }
            }
        };
    }


    // if (valueObj === "CHAT") {
    //     const threadName = mess.body?.chat?.messagePayload?.message?.thread?.name || mess.body?.message?.thread?.name;

    //     // Create the clean root-level object the latest Google Chat API expects
    //     const responsePayload = {
    //         text: value
    //     };

    //     // Safely apply the thread context only if it exists
    //     if (threadName) {
    //         responsePayload.thread = { name: threadName };
    //     }

    //     return responsePayload;
    // }




    // if (valueObj === "CHAT") {
    //     return {
    //         text: value
    //     };
    // }

    // if (valueObj === "CHAT") {
    //     return {
    //         text: value,
    //         thread: {
    //             name: mess.body?.chat?.messagePayload?.message?.thread?.name || mess.body?.message?.thread?.name
    //         }
    //     };
    // }










    if (mess.body?.entry?.[0]?.changes?.[0]?.value?.messaging_product === "whatsapp") {
        const recipientId = mess.body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.from;
        const incomingMessageId = mess.body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.id;
        if (!recipientId) {
            console.log("Webhook received, but it's a status update (delivered/read), not an incoming message.");
            return;
        }
        try {
            const response = await fetch(
                `https://graph.facebook.com/v25.0/${process.env.phone_number_id}/messages`,
                {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${process.env.whatsapp_api_test}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        messaging_product: "whatsapp",
                        to: recipientId,
                        type: "text",
                        text: {
                            body: value
                        }
                    })
                }
            );

            const data = await response.json();
            if (!response.ok) {
                console.log("WhatsApp API Error Response:", data);
            } else {
                console.log("Message sent successfully:", data.messages?.[0]?.id);
            }
        } catch (err) {
            console.log("Failed to execute fetch to Meta API:", err);
        }
    }
    else if (mess.channel?.send) {
        try {
            return await mess.channel.send(value);
        } catch (error) {
            console.log("Error in Sending Discord Message!")
        }
    }
}

async function reply(mess, value) {
    // const valueObj = mess.body?.entry?.[0]?.changes?.[0]?.value || mess.body?.commonEventObject?.hostApp;
    // const valueObj = mess.body?.entry?.[0]?.changes?.[0]?.value || (isGoogleChat ? "CHAT" : null);
    const isGoogleChat =
        !!mess.body?.chat ||
        !!mess.body?.space ||
        !!mess.body?.commonEventObject;

    if (isGoogleChat) {
        try {
            return {
                hostAppDataAction: {
                    chatDataAction: {
                        createMessageAction: {
                            message: {
                                text: value
                            }
                        }
                    }
                }
            };
        }

        catch (error) {
            console.log("Error in sending the Contextual Message in Google Chats....." + error.message)
        }
    }

    // if (valueObj === "CHAT") {
    //     return {
    //         text: value,
    //         thread: {
    //             name: mess.body?.chat?.messagePayload?.message?.thread?.name || mess.body?.message?.thread?.name
    //         }
    //     };
    // }

    // if (valueObj === "CHAT") {
    //     return {
    //         text: value
    //     };


    // }





    if (mess.body?.entry?.[0]?.changes?.[0]?.value?.messaging_product === "whatsapp") {
        const recipientId = mess.body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.from;
        const incomingMessageId = mess.body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.id;
        if (!recipientId) {
            console.log("Webhook received, but it's a status update (delivered/read), not an incoming message.");
            return;
        }
        try {
            const response = await fetch(
                `https://graph.facebook.com/v25.0/${process.env.phone_number_id}/messages`,
                {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${process.env.whatsapp_api_test}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        messaging_product: "whatsapp",
                        to: recipientId,
                        context: {
                            message_id: incomingMessageId
                        },
                        type: "text",
                        text: {
                            body: value
                        }
                    })
                }
            );

            const data = await response.json();
            if (!response.ok) {
                console.error("WhatsApp API Error Response:", data);
            } else {
                console.log("Message sent successfully:", data.messages?.[0]?.id);
            }
        } catch (err) {
            console.error("Failed to execute fetch to Meta API:", err);
        }
    }
    // else{
    //     try {
    //         return await mess.reply(value)
    //     } catch (error) { console.log("Error in Sending Message from WhatsApp under Reply section!") }
    // }

    if (!isGoogleChat && mess.reply) {
        return await mess.reply(value);
    }
}


// async function imp(mess, inter) {
//     const filter = m => m.author.id === mess.author.id;
//     const timeCollected = await mess.channel.awaitMessages({ filter, max: 1, time: inter, errors: ['time'] });
// }
async function WhatsAppHelloCard(mess, name, name1) {

    const recipientId =
        mess.body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.from;

    if (!recipientId) return;

const intro = mess.body?.entry?.[0]?.changes?.[0]?.value?.messaging_product === "whatsapp"
      ? `🙂‍↔️ Hi there ${name}`
      : `🙂‍↔️ Hi there ${name} aka ${name1}`;
    const payload = {

        messaging_product: "whatsapp",

        recipient_type: "individual",

        to: recipientId,

        type: "interactive",

        interactive: {

            type: "list",

            header: {
                type: "text",
                text: WhatsAppmenu.title + "\n\n"
            },

            body: {
                text: intro + WhatsAppmenu.body
            },

            footer: {
                text: WhatsAppmenu.footer
            },

            action: {
                button: WhatsAppmenu.button,
                sections: WhatsAppmenu.sections
            }
        }
    };

    try {

        const response = await fetch(
            `https://graph.facebook.com/v25.0/${process.env.phone_number_id}/messages`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${process.env.whatsapp_api_test}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            }
        );

        const data = await response.json();

        if (!response.ok)
            console.log("WhatsApp Error:", data);
        else
            console.log("Interactive menu sent.");

    }
    catch (err) {
        console.log(err);
    }
}


async function GoogleChatHelloCard(mess, name, name1) {
const intro = mess.body?.entry?.[0]?.changes?.[0]?.value?.messaging_product === "whatsapp"
      ? `🙂‍↔️ Hi there ${name}`
      : `🙂‍↔️ Hi there ${name} aka ${name1}`;
    return {

        hostAppDataAction: {

            chatDataAction: {

                createMessageAction: {

                    message: {

                        cardsV2: [

                            {

                                cardId: "bivi_menu",

                                card: {

                                    header: {

                                        title: googleChatMenu.title + "\n",

                                        subtitle: intro + "\n" +googleChatMenu.subtitle

                                    },

                                    sections: [

                                        // Body Section
                                        {

                                            widgets: [

                                                {

                                                    textParagraph: {

                                                        text: googleChatMenu.body

                                                    }

                                                }

                                            ]

                                        },

                                        // Command Sections
                                        ...googleChatMenu.sections.map(section => ({

                                            header: section.title,

                                            widgets: section.rows.map(row => ({

                                                buttonList: {

                                                    buttons: [

                                                        {

                                                            text: row.title,

                                                            onClick: {

                                                                action: {

                                                                    actionMethodName: row.id,

                                                                    parameters: [

                                                                        {

                                                                            key: "command",

                                                                            value: row.id

                                                                        }

                                                                    ]

                                                                }

                                                            }

                                                        }

                                                    ]

                                                }

                                            }))

                                        })),

                                        // Footer
                                        {

                                            widgets: [

                                                {

                                                    textParagraph: {

                                                        text: `<i>${googleChatMenu.footer}</i>`

                                                    }

                                                }

                                            ]

                                        }

                                    ]

                                }

                            }

                        ]

                    }

                }

            }

        }

    };

}

function getPlatform(mess) {

    if (mess.body?.commonEventObject?.hostApp === "CHAT")
        return "google";

    if (mess.body?.entry?.[0]?.changes?.[0]?.value?.messaging_product === "whatsapp")
        return "whatsapp";

    if (mess.author?.id)
        return "discord";

    return "unknown";
}

let platform = "";


async function buildInteractiveMessage(mess, menu) {

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


    const isWhatsApp =
        mess.body?.entry?.[0]?.changes?.[0]?.value?.messaging_product === "whatsapp";

    const isGoogle =
        !!mess.body?.chat ||
        !!mess.body?.space ||
        !!mess.body?.commonEventObject;

    if (isWhatsApp) {

        return buildWhatsAppInteractive(menu);

    }

    if (isGoogle) {

        return buildGoogleChatInteractive(menu);

    }

    return discordMenu(menu);

}




























    async function del(mess) {

        const googleMessage =
            mess.body?.chat?.messagePayload?.message;


        // Google Chat Webhook
        if (googleMessage) {

            const repliedMessage =
                googleMessage?.referencedMessage;


            const messageName =
                repliedMessage?.name;


            if (!messageName) {
                console.log("No replied Google message found");
                return;
            }


            const token = process.env.google_chats_token;


            const response = await fetch(
                `https://chat.googleapis.com/v1/${messageName}`,
                {
                    method: "DELETE",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }
            );


            if (!response.ok) {
                console.log(
                    "Google delete failed:",
                    await response.text()
                );
            }

            return;
        }


        // Discord
        if (mess.fetchReference) {
            const repliedMessage = await mess.fetchReference();
            return await repliedMessage.delete();
        }
    }

const clear = async (mess, session, sessions) => {
    const userIDID = mess?.author?.id || mess.body?.entry?.[0]?.changes?.[0]?.value?.contacts?.[0]?.wa_id || mess.body?.chat?.user?.name;
    const input = mess.content.toLowerCase();
    if (session.step !== "awaiting_confirm") return;

    if (input === "no") {
        indi_reply(mess, "Cancelled");
        sessions.delete(userIDID);
        return;
    }
    if (input.includes("all") || input == "yes:all") {
        const messages = await mess.channel.messages.fetch({ limit: 100 });

        await mess.channel.bulkDelete(messages, true);

        sessions.delete(userIDID);
        return await indi_reply(mess, "Cleared all messages...");
    }

    let num = 10;
    if (input.startsWith("yes")) {
        if (input.includes(":")) {
            const raw = input.split(":")[1]
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
        sessions.delete(userIDID);
        return indi_reply(mess, `Cleared last ${num} Bot Messages...`);
    }
    indi_reply(mess, "Invalid input, cancelled");
    sessions.delete(userIDID);
}


const bot = getEncoding("cl100k_base")
let tokensThisMinute = 0;
const TOKEN_Limit = 6000;

setInterval(() => tokensThisMinute = 0, 60000);

function checker(mess) { //,value
    const text = filt(mess.body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.text?.body || mess.content || mess.body?.chat?.messagePayload?.message?.text)
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
        tokensThisMinute += tokenfinder(mess)
        if ((text.startsWith('force:')) && text.includes(" ")) {
            const rep = filt(String(text.split(":").slice(1,)));
            return BiVi_Force_Reply(mess);
        }
        return BiVi(mess);
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

module.exports = { indi_reply, filt, reply, del, clear, checker, fetching, indi_image_send , WhatsAppHelloCard, GoogleChatHelloCard}
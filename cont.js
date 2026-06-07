require('dotenv').config()
const { unfinished, command, hello, userInfo, serverInfo, botInfo, commands_arr } = require('./messages.js')


let ph_number


function incom_mess(req, res) {
    const value = req.body.entry[0].changes[0].value;

    const mess = value.messages[0].text.body;

    const ph_number = value.contacts[0].wa_id;
    const uid = value.contacts[0].user_id;
    const uname = value.contacts[0].profile.name;
    const messageId = value.messages?.[0].id

    console.log(`
Message: ${mess}
Phone Number: ${ph_number}
UserName: ${uname}
UserId: ${uid}
messageId = ${messageId};`)
}





// async function wa_reply(to, text) {
//     await fetch(
//         `https://graph.facebook.com/v25.0/${process.env.phone_number_id}/messages`,
//         {
//           method: "POST",
//         headers: {
//             "Authorization": `Bearer ${process.env.whatsapp_api_test}`,
//             "Content-Type": "application/json"
//         },
//         body: JSON.stringify({
//             messaging_product: "whatsapp",
//             to: to,
//             type: "text",
//             text: {
//                 body: text
//           }
//         })
//     }
// );
// }







function incom_mess(req) {
    const value = req.body?.entry?.[0]?.changes?.[0]?.value;
    if (!value || !value.messages) return;

    const mess = value.messages[0]?.text?.body || "Non-text message";
    const ph_number = value.contacts?.[0]?.wa_id;
    const uid = value.contacts?.[0]?.user_id || "N/A";
    const uname = value.contacts?.[0]?.profile?.name || "Unknown";
    const messageId = value.messages?.[0]?.id;

    console.log(`
--- New Message Received ---
Message: ${mess}
Phone Number: ${ph_number}
UserName: ${uname}
UserId: ${uid}
Message ID: ${messageId}
----------------------------`);
}

async function wa_reply(to, text) {
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
                    to: to,
                    type: "text",
                    text: {
                        body: text
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

console.log(process.env.phone_number_id, process.env.whatsapp_api_test)

module.exports = { incom_mess , wa_reply}








    // let  = req.body.entry[0].changes[0].value.messages[0].text.body
    // let number = req.body.entry[0].changes[0].value.messages[0].text.body
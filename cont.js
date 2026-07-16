require('dotenv').config()
const { unfinished, command, hello, userInfo, serverInfo, botInfo, commands_arr } = require('./messages.js')


let ph_number


// function incom_mess(req, res) {
//     const value = req.body.entry[0].changes[0].value;

//     const mess = value.messages[0].text.body;

//     const ph_number = value.contacts[0].wa_id;
//     const uid = value.contacts[0].user_id;
//     const uname = value.contacts[0].profile.name;
//     const messageId = value.messages?.[0].id

//     console.log(`
// Message: ${mess}
// Phone Number: ${ph_number}
// UserName: ${uname}
// UserId: ${uid}
// messageId = ${messageId};`)
// }





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



async function ins_reply(to, text) {
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








async function instagramProfileFetch(mess) {
    try {
        // const userId = "17841416939972611";
        const userId = mess.body?.entry?.[0]?.messaging?.[0]?.sender?.id;

        const response = await fetch(
            `https://graph.instagram.com/v25.0/${userId}?fields=id,name,username,profile_pic,is_verified_user,follower_count,is_user_follow_business,is_business_follow_user&access_token=${process.env.instagram_access_token}`
        );

        const data = await response.json();

        if (!response.ok || data.error) {
            console.error("Instagram Profile Fetch Error:", data);
            return null;
        }
        //         console.log(`
        // --- New Message Received ---
        // Message: ${}
        // Phone Number: ${ph_number}
        // UserName: ${uname}
        // UserId: ${uid}
        // Message ID: ${messageId}
        // ----------------------------`);
        return {
            id: data.id,
            username: data.username,
            displayName: data.name,
            is_verified: data.is_verified_user,
            followers: data.follower_count,
            raw: data
        };

    } catch (err) {
        console.error("Instagram Profile Fetch Failed:", err);
        return null;
    }
}




async function instagramBiViProfileFetch(mess) {
    try {
        // Fix 1: Ensure the ID is a string to prevent JavaScript from rounding the last digit
        // const userId = "17841416939972611";
        const userId = mess.body?.entry?.[0]?.messaging?.[0]?.sender?.id

        const response = await fetch(
            `https://graph.facebook.com/v25.0/${userId}?fields=id,name,username,followers_count,follows_count,ig_id,profile_picture_url,website&access_token=${process.env.instagram_access_token}`
        );

        const data = await response.json();

        if (!response.ok || data.error) {
            console.error("Instagram Profile of BiVi Fetch Error:", data);
            return null;
        }

        return {
            id: data.id,
            username: data.username,
            displayName: data.name,
            profilePicture: data.profile_picture_url,
            followers: data.followers_count,
            follows: data.follows_count
            // raw: data
        };

    } catch (err) {
        console.error("Instagram Profile Fetch Failed:", err);
        return null;
    }
}






module.exports = { incom_mess, wa_reply, instagramProfileFetch, instagramBiViProfileFetch }








// let  = req.body.entry[0].changes[0].value.messages[0].text.body
// let number = req.body.entry[0].changes[0].value.messages[0].text.body
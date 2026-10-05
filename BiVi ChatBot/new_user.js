const { reply } = require('./controller.js')
const temp_sessions = new Map();
const { MongoClient } = require('mongodb');
const { hello } = require('./new_user_message.js');
require("dotenv").config()

const client_mongo = MongoClient(process.env.uri)
client_mongo.connect()

async function new_user(mess) {
    const start = performance.now()

    function end() {
        let endit = performance.now()
        return `\n\n~${(endit - start).toFixed(2)}ms`;
    }
    const messageType =
        mess.body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.type;
    if (messageType && messageType !== "text" && messageType !== "interactive") {
        return await reply(mess, "Sorry dear, We currently don't support other than Text Inputs!" + end());
    }

    const userId = mess.author?.id ||
        mess.body?.entry?.[0]?.changes?.[0]?.value?.contacts?.[0]?.wa_id ||
        mess.body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.from ||
        mess.body?.chat?.user?.name ||
        mess.body?.entry?.[0]?.messaging?.[0]?.sender?.id;

    const user_main_id = "BV" + userId;

    const chatId =
        mess.guild?.id ||
        mess.channel?.id ||
        mess.body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.group_id ||
        mess.body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.from ||
        mess.body?.chat?.messagePayload?.space?.name ||
        userId;

    const raw1 =
        mess.body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.text?.body ||
        mess.body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.interactive?.list_reply?.id || mess?.body?.entry?.[0]?.messaging?.[0]?.message?.text ||
        mess.content || mess.body?.chat?.messagePayload?.message?.text || mess.body?.commonEventObject?.invokedFunction ||
        "";

}
let raw = raw1;
if (userGroupMode || groupAllMode) {
    raw = raw1.startsWith(".")
        ? raw1.slice(1)
        : raw1;
}
else if (raw1.startsWith(".")) {
    raw = raw1.slice(1);
}

const hasDotPrefix = raw1.startsWith(".");

let platform = "None"
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
    else if (mess.body?.object === "instagram") {
        platform = 'instagram'
        const event = mess.body.entry?.[0]?.messaging?.[0];

        if (!event) return;
        if (!event.message) return;
        if (event.message.is_echo) return;
        if (event.read) return;
        if (event.delivery) return;

        // var profile = await instagramProfileFetch(mess);
    }
    else if (mess.author?.id) {
        platform = 'discord';
    }
} catch (error) {
    console.log("Error in sending the Message!");
}
const name = mess.author?.globalName || mess?.body?.entry?.[0]?.changes?.[0]?.value?.contacts?.[0]?.profile?.name || mess.body?.chat?.messagePayload?.message?.sender?.displayName || profile?.displayName || `User ${userId}`;
const value = filt(raw);

const session = temp_sessions.get(user_main_id);

if (!session) {
    // temp_sessions.set(user_main_id, {
    //     stage: null,
    //     stage_state: null,
    //     createdAt: Date.now()
    // });
    temp_sessions.set(user_main_id, {

        stage: "login_or_signup",
        stage_state: "login_or_signup_yes_or_no",
        createdAt: Date.now()
    });
    return await reply(hello(mess, name));
}
// if (!session.stage && value !== "yes" && value !== "no") {
//     return await reply(
//         mess,
//         "We received invalid input. Please reply with Yes or No."
//     );
// }
// if (value && !session.stage) {
//     session.set(user_main_id, {

//         stage: "login_or_signup",
//         stage_state: "login_or_signup_yes_or_no",
//         createdAt: Date.now()
//     });
//     return await reply(hello(mess, name));
// }

if (
    (session.stage_state === "login_or_signup_yes_or_no" || session.stage_state === "email_yes_or_no" || session.stage_state === "lang_yes_or_no" || session.stage_state === "mood_yes_or_no" || session.stage_state === "name_yes_or_no") &&
    value !== "yes" &&
    value !== "no"
) {
    return await reply(
        mess,
        "We received invalid input. Please reply with Yes or No."
    );
}

if (value === "no" && session.stage_state == "login_or_signup_yes_or_no") {
    temp_sessions.set(user_main_id, {

        stage: "login_or_signup",
        stage_state: "login_or_signup",
        createdAt: Date.now(),
        bannetAt: Date.now()
    });
    return await reply(hello(mess, name));
}
if (
    session.stage === "login_or_signup" &&
    value !== "login" &&
    value !== "signup"
) {
    return await reply(
        mess,
        "We received invalid input. Please reply with Login or Signup."
    );
}
if (value === "yes" && session.stage_state == "login_or_signup_yes_or_no") {
    temp_sessions.set(user_main_id, {

        stage: "login_or_signup",
        stage_state: "login_or_signup",
        createdAt: Date.now()
    });
    return await reply(hello(mess, name));
}

if (value == "login" && session.stage == "login_or_signup") {
    temp_sessions.set(user_main_id, {
        stage: "login",
        stage_state: "login_or_signup",
        createdAt: Date.now()
    });
    return await reply(mess, "let's start the login process");
}
if (value == "signup" && session.stage == "login_or_signup" && session.stage_state === undefined) {
    temp_sessions.set(user_main_id, {
        stage: "signup",
        stage_state: "yes_or_no",
        createdAt: Date.now()
    });
    return await reply(mess, "let's start the signup process, confirm yes or no....");
}

if (value == "yes" && session.stage == "signup" && session.stage_state === "yes_or_no") {
    temp_sessions.set(user_main_id, {
        stage: "signup",
        stage_state: "name_yes_or_no",
        createdAt: Date.now()
    });
    return await reply(mess, "First Name!\n Please tell me whether you want to continue with this name or with custom name\n Yes-> Continue with this name, No-> Enter custom name");
}


//eeeeenter the name of the user cause he said NO and wanted to enter custom name
if (value == "no" && session.stage == "signup" && session.stage_state === "name_yes_or_no") {
    temp_sessions.set(user_main_id, {
        stage: "signup",
        stage_state: "enter_name",
        createdAt: Date.now()
    });
    return await reply(mess, "Please enter Name:");
}



// User entereing custom name!!!!!!!!!!!
if (value && session.stage == "signup" && session.stage_state === "enter_name") {
    if (platform === "whatsapp" || platform === "instagram") {
        temp_sessions.set(user_main_id, {
            stage: "signup",
            stage_state: "email_yes_or_no",
            createdAt: Date.now()
        });
    }
    if (platform === "discord" || platfrom === "chat") {
        temp_sessions.set(user_main_id, {
            stage: "signup",
            stage_state: "ph_yes_or_no",
            createdAt: Date.now()
        });
    }
    return await reply(mess, "You can always change your name in the accounts section. Btw, I will call you with this name..........", name);
}




if ((platform === "whatsapp" || platform === "instagram") && session.stage == "signup") {
    // User entered yes in name as he wants to continue with the same name, now entereing the email enterance!
    if (value == "yes" && session.stage_state === "name_yes_or_no") {
        temp_sessions.set(user_main_id, {
            stage: "signup",
            stage_state: "email_yes_or_no",
            createdAt: Date.now()
        });
        return await reply(mess, "Now Email!\n Please tell me whether you want to continue with giving your email?\n Yes-> Yes I want to enter email address, No-> No I don't!");
    }

    //Asking user to whether he/she wanted to enter the email address or not....
    // if (value == "yes" && session.stage === "email_yes_or_no") {
    //     session.set(user_main_id, {
    //         stage: "signup",
    //         stage_state: "email_yes_or_no",
    //         createdAt: Date.now()
    //     });
    //     return await reply(mess, "Now Email!\n Please tell me whether you want to continue with giving your email?\n Yes-> Yes I want to enter email address, No-> No I don't!");
    // }


    //User enteed no in entering email, now asking for language!
    if (value == "no" && session.stage_state === "email_yes_or_no") {
        temp_sessions.set(user_main_id, {
            stage: "signup",
            stage_state: "pass_enter",
            createdAt: Date.now()
        });
        return await reply(mess, "Now Password!\nPlease Enter Password:");
    }

    // //User enteed no in entering email, now asking for language!
    //     if (value == "no" && session.stage === "email_yes_or_no") {
    //         session.set(user_main_id, {
    //             stage: "signup",
    //             stage_state: "lang_yes_or_no",
    //             createdAt: Date.now()
    //         });
    //         return await reply(mess, "Now Language!\nLanguage is already selected to be english, Please tell me whether you want to change the language? Yes-> Change it! No-> No I don't want to change!");
    //     }

    //User enteed yes in entering email, now asking for Email address!
    if (value == "yes" && session.stage === "email_yes_or_no") {
        temp_sessions.set(user_main_id, {
            stage: "signup",
            stage_state: "enter_email",
            createdAt: Date.now()
        });
        return await reply(mess, "Enter Email: !");
    }


    //User enteed the email, now asking for password!
    if (
    value &&
    session.stage === "signup" &&
    session.stage_state === "enter_email"
) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(value)) {
        return await reply(
            mess,
            "We received an invalid email address. Please enter a valid email."
        );
    }

    temp_sessions.set(user_main_id, {
        stage: "signup",
        stage_state: "pass_enter",
        createdAt: Date.now()
    });

    await reply(mess, "Entered Email:", value);
    return await reply(
        mess,
        "Now Password!\nPlease Enter Password:"
    );
}
    // if (value && session.stage === "signup" && session.stage_state === "enter_email") {
    //     temp_sessions.set(user_main_id, {
    //         stage: "signup",
    //         stage_state: "pass_enter",
    //         createdAt: Date.now()
    //     });
    //     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    //     if (!emailRegex.test(value)) {
    //         return await reply(
    //             mess,
    //             "We received an invalid email address. Please enter a valid email."
    //         );
    //     }
    //     await reply(mess, "Entered Email:", value);
    //     return await reply(mess, "Now Password!\nPlease Enter Password:");
    // }






    // //User enteed the email, now asking for !
    // if (value  && session.stage === "enter_email") {
    //     session.set(user_main_id, {
    //         stage: "signup",
    //         stage_state: "lang_yes_or_no",
    //         createdAt: Date.now()
    //     });
    //     await reply(mess, "Entered Email:", value);
    //     return await reply(mess, "Now Language!\nLanguage is already selected to be english, Please tell me whether you want to change the language? Yes-> Change it! No-> No I don't want to change!");
    // }




}





if (
    value &&
    session.stage === "signup" &&
    session.stage_state === "pass_enter"
) {
    if (value.length < 8) {
        return await reply(
            mess,
            "Password must be at least 8 characters long."
        );
    }
    temp_sessions.set(user_main_id, {
        stage: "signup",
        stage_state: "lang_yes_or_no",
        createdAt: Date.now(),
    });
    await reply(mess, "Entered Password!");
    return await reply(mess, "Now Language!\nLanguage is already selected to be english, Please tell me whether you want to change the language? Yes-> Change it! No-> No I don't want to change!");
}








if ((platform === "discord" || platform === "chat") && session.stage == "signup") {
    // User entered yes in name as he wants to continue with the same name, now entereing the email enterance!
    if (value == "yes" && session.stage_state === "name_yes_or_no") {
        temp_sessions.set(user_main_id, {
            stage: "signup",
            stage_state: "ph_yes_or_no",
            createdAt: Date.now()
        });
        return await reply(mess, "Now Phone Number!\n Please tell me whether you want to continue with giving your Phone Number?\n Yes-> Yes I want to enter email address, No-> No I don't!");
    }

    // //Asking user to whether he/she wanted to enter the phone Number or not....
    // if (value == "yes" && session.stage_state === "ph_yes_or_no") {
    //     temp_sessions.set(user_main_id, {
    //         stage: "signup",
    //         stage_state: "ph_yes_or_no",
    //         createdAt: Date.now()
    //     });
    //     return await reply(mess, "Now Email!\n Please tell me whether you want to continue with giving your email?\n Yes-> Yes I want to enter email address, No-> No I don't!");
    // }

    //User enteed yes in entering Phone Number, now asking for language!
    if (value == "yes" && session.stage_state === "ph_yes_or_no") {
        temp_sessions.set(user_main_id, {
            stage: "signup",
            stage_state: "enter_ph",
            createdAt: Date.now()
        });
        return await reply(mess, "Enter Phone Number: !");
    }

    //User entered the Phone Number, now asking for language!
    if (
        value &&
        session.stage === "signup" &&
        session.stage_state === "enter_ph"
    ) {
        const phoneRegex = /^\+?[1-9]\d{7,14}$/;

        if (!phoneRegex.test(value)) {
            return await reply(
                mess,
                "We received an invalid phone number. Please enter a valid phone number."
            );
        }
        temp_sessions.set(user_main_id, {
            stage: "signup",
            stage_state: "pass_enter",
            createdAt: Date.now()
        });
        await reply(mess, "Entered Phone Number:", value);
        await reply(mess, "Now Password!\nPlease Enter Password:")
    }


    //User enteed no in entering Phone Number, now asking for language!
    if (value == "no" && session.stage_state === "ph_yes_or_no") {
        temp_sessions.set(user_main_id, {
            stage: "signup",
            stage_state: "pass_enter",
            createdAt: Date.now()
        });
        return await reply(mess, "Now Password!\nPlease Enter Password:");
    }

}
















//User enteed no in entering custom lang, now asking for mood!
if (value == "no" && session.stage == "signup" && session.stage_state === "lang_yes_or_no") {
    temp_sessions.set(user_main_id, {
        stage: "signup",
        stage_state: "mood_yes_or_no",
        createdAt: Date.now()
    });
    return await reply(mess, "Now Mood!\nMood is already selected to be 'Savage', Please tell me whether you want to change the mood? You can also change it later!\nYes-> Change it! No-> No I don't want to change!");
}


//User enteed no in entering custom mood, now asking for privacy policy!
if (value == "no" && session.stage == "signup" && session.stage_state === "mood_yes_or_no") {
    temp_sessions.set(user_main_id, {
        stage: "signup",
        stage_state: "privacy_yes_or_no",
        createdAt: Date.now()
    });
    return await reply(mess, "BiVi may store your preferences and account information to provide its services. Continue?");
}



if (value == "no" && session.stage == "signup" && session.stage_state === "privacy_yes_or_no") {
    temp_sessions.set(user_main_id, {
        stage: "signup",
        stage_state: "banned",
        createdAt: Date.now(),
        bannetAt: Date.now()
    });

    return await reply(mess, "Umm, Okay! Exiting the SignUp Process. Also your details have been entered in the ban section. Please note that you can't again access bivi with this account till next 24 hours!");
}

if (session.stage_state == "banned") {
    return;
}




if (value == "yes" && session.stage == "signup" && session.stage_state === "privacy_yes_or_no") {
    temp_sessions.set(user_main_id, {
        stage: "signup",
        stage_state: "privacy_yes_or_no",
        createdAt: Date.now()
    });
    return await reply(mess, "Thanks For Signing Up! Your Account has been entered in the database!");
}












if (
    isGroup &&
    !hasDotPrefix &&
    !userGroupMode &&
    !groupAllMode
) {
    return;
}


























module.exports = { new_user }
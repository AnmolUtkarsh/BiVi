//["Title: Testing", "Published by: User", "Story Genre: None","Volume: N.A","Part: N.A", "Published at: Date"]

const { indi_reply, filt } = require("./controller");



const story1 = [[
    "Title: Testing", "Published by: User", "Story Genre: None", "Volume: N.A", "Part: N.A", "Published at: Date"
],
[
    "Story Line one",
    "Story Line two",
    "Story Line three",
    "Story Line four",
    "Story Line five",
    "Story Line six",
    "Story Line seven",
    "Story Line eight",
    "Story Line nine",
    "Story Line ten",
    "Story Line eleven",
    "Story Line twelve",
    "Story Line thirteen",
    "Story Line fourteen",
    "Story Line fifteen",
    "Story Ends"
]];
const WillFam1 = [
    [
        "Title: Willson Family [*Vol 1*][*Part 1*]", "Published by: Abhijnan", "Story Genre: Explicit-Entertainment", "Volume: 1/10", "Part: 1/10", "Characters: \nWillson [Chicken], \nWillson's Wife [Wife of Willson[Chicken]], \nWillson Jr. [Child of Willson[Chicken]]", "Published at: 02-06-2026 12:43am",
    ],
    [
        "Willson's Wife: Willson hasn't been picking up my call recently 😭...\nI wonder....what happed since there was a huge flood at his work place KFC...I wonder if he's okay. 🐔😭",

        "Willson Jr.: Mommy whens Daddy's going to return?, I want to play with him! 😭😭\nI am Feeling Lonely 😭💔.",

        "Willson's Wife: ...Dont worry Son, even mommy feels lonely...without daddy at night 💔,",
        "Willson's wife: Imagine spending nights with a Cucumber even after marriage...🥒🤌🏻😭,\n Well, I am Sure he's fine my son...",

        "Willson Jr.: _(In Low Volume)_ ...Mommy what about Cucumber...💀🥒⁉️",

        "Willson's Wife: ... You and your's is too small Son...🤏🏻,",
        "Willson's Wife: you will understand once you grow older...",

        "Willson Jr.: Okay mom... \n\n _(Thinking: Mommy's been acting very lonely since Daddy left...why does she takes cucumbers to her room every night...🤨🥒⁉️)_",
        "Willson Jr.: Well I guess I will go sleep, its already late."
    ]
];



async function storyplay(mess, storys, num = 15, sessions) {

    const userId = mess?.author?.id || mess.body?.entry?.[0]?.changes?.[0]?.value?.contacts?.[0]?.user_id || mess.body?.chat?.user?.name;

    sessions.set((userId), { type: "Playing_Story" });
    if (!isNaN(num)) {

        if (num < 15 || num > 60) {
            await indi_reply(mess, "Error Playing the Story Cause the Time Set is Less than 15 Seconds.")
        }
        else {
            num *= 1000;
            const story = [storys[0], [...storys[1], "Story Ends Here..."]];
            await indi_reply(mess, `Story:
${story[0][0]}\n${story[0][1]}\n${story[0][2]}\n${story[0][3]} , ${story[0][4]}\n${story[0][5]}\n${story[0][6]}\nTotal Time: *${((num / 1000) * story[1].length).toFixed(2)}*s or *${((((num / 1000) / 60) * story[1].length)).toFixed(2)}*min
Selected Time Duration: ${(num / 1000).toFixed(2)}s OR ${((num / 1000) / 60).toFixed(2)}min

${story[0][0].split(":")[1]} Story is Starting in 15 Seconds...
Read: We have entered few Commands for Story Mode: Start/Play/Resume, Pause, Stop, Restart

Start/Play/Resume -> For Starting after Pause.
Pause -> For Pausing the Story for almost 10 mins, after than timeout!
Stop -> Permanently Stop the Story for that Session!
Restart -> Restarting the Story.

In between the Story if you write External Commands, it will not work for the User who initiated this Story, For everybody else the external commands will work!`)
            let st = setTimeout(() => {
                let i = 0;
                





                const interval2 = setInterval(async () => {
                    const currentSession = sessions.get(userId);

                if(!currentSession || currentSession.type == "Stopped"){
                    clearInterval(interval2);
                    sessions.delete(userId);
                    return;
                }
                if(!currentSession || currentSession.type == "Paused"){
                    return;
                }

                if (currentSession.type == "Restart"){
                    
                    i = 0;
                    sessions.set(userId,{
                        type: "Playing_Story"
                    })
                    return;
                }
                    
                    
                    
                    if (i >= story[1].length) {
                        clearInterval(interval2);
                        sessions.delete(userId)
                        return;
                    }
                    await indi_reply(mess, String(story[1][i]));
                    i++;
                }, num)
            }, 15000)
        }
    }
}

let stories = { "[1] Storytest": story1, "[2] Willson Family Vol 1 Part 1": WillFam1 }
let store = {
    1: stories["[1] Storytest"],
    2: stories["[2] Willson Family Vol 1 Part 1"]
}
module.exports = { storyplay, stories, store }
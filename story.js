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
        "Title: Willson Family [*Vol 1*][*Part 1*]", "Published by: Abhijnan", "Story Genre: Explicit-Entertainment", "Volume: 1/10", "Part: 1/10", "Published at: 02-06-2026 12:43am",
    ],
    [
        "Willson's wife: ... willson hasn't been picking up my call recently...",
        "Willson's wife: I wonder what happed since there was a huge flood at his work place KFC...",
        "Willson's wife: I wonder if he's okay.",

        "willson jr.: Mommy whens Daddy going to return,",
        "willson jr.: I want to play with him",
        "willson jr.: I am lonely.",

        "Willson's wife: ... Dont worry Son, even mommy feels lonely without daddy at night,",
        "Willson's wife: imagine spending nights with a Cucumber even after marriege....",
        "Willson's wife: I am Sure he's fine my son.",

        "willson jr.: ... Mommy what about cucumber?",

        "Willson's wife: ... You and your's is too small Son,",
        "Willson's wife: you will understand once you grow older.",

        "wisson jr: Okay mom... (momy's been acting very weird since daddy left... why does she takes cucumbers to her room every night..)...",
        "wisson jr: Well I guess I will go sleep, its already late."
    ]
];



async function storyplay(mess, storys, num = 15, sessions) {
    sessions.set(mess.author.id, { type: "Playing_Story" });
    if (!isNaN(num)) {

        if (num < 15 || num > 60) {
            await indi_reply(mess, "Error Playing the Story Cause the Time Set is Less than 15 Seconds.")
        }
        else {
            num *= 1000;
            const story = [storys[0], [...storys[1], "Story Ends Here..."]];
            await indi_reply(mess, `Story:
${story[0][0]}\n${story[0][1]}\n${story[0][2]}\n${story[0][3]} , ${story[0][4]}\n${story[0][5]}\nTotal Time: *${((num / 1000) * story[1].length).toFixed(2)}*s or *${((((num / 1000) / 60) * story[1].length)).toFixed(2)}*min
${story[0][0]}
Selected Time Duration: ${(num / 1000).toFixed(2)}s OR ${((num / 1000) / 60).toFixed(2)}min

${story[0][0]} Story is Starting in 15 Seconds...`)
            let st = setTimeout(() => {
                let i = 0;
                





                const interval2 = setInterval(() => {
                    const currentSession = sessions.get(mess.author.id);

                if(!currentSession || currentSession.type == "Stopped"){
                    clearInterval(interval2);
                    sessions.delete(mess.author.id);
                    return;
                }
                if(!currentSession || currentSession.type == "Paused"){
                    return;
                }

                if (currentSession.type == "Restart"){
                    
                    i = 0;
                    sessions.set(mess.author.id,{
                        type: "Playing_Story"
                    })
                    return;
                }
                    
                    
                    
                    if (i >= story[1].length) {
                        clearInterval(interval2);
                        sessions.delete(mess.author.id)
                        return;
                    }
                    indi_reply(mess, String(story[1][i]));
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
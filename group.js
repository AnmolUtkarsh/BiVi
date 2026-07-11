// function groupFetch(userId) {
//     const grou = groups.get(userId);

//     if (!grou) return "Group_Off";
//     return grou.state;
// }
const groups = new Map()
const group_TIMEOUT = 24 * 60 * 60 * 1000;

function groupFetch(chatId, userId) {
    return groups.get(`${chatId}:${userId}`)?.state || "Group_Off";
}


// function isGroupModeEnabled(userId) {
//     const grou = groups.get(userId);

//     if (!grou) return false;

//     return grou.state === "Group_On";
// }

function isGroupModeEnabled(chatId, userId) {
    return groupFetch(chatId, userId) === "Group_On";
}

module.exports = {
    groups,
    groupFetch,
    isGroupModeEnabled
};
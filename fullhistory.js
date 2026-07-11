const { groups } = require("./group");
const { isHistoryEnabled } = require("./history_save");

const fullHistories = new Map();



function getFullHistory(userId) {
  if (!fullHistories.has(userId)) {
    fullHistories.set(userId, []);
  }
  return fullHistories.get(userId);
}




function shorten(text, limit = 25) {
  text = String(text).trim();

  if (text.length <= limit) {
    return text;
  }

  return text.slice(0, limit) + "....";
}








function logToFullHistory(userId, chatId, userText, assistantText) {
  if (!isHistoryEnabled(userId)) return;

  if (chatId && groups.get(chatId)?.state === "Group_All_On") {
    return;
  }
  const fullHistory = getFullHistory(userId);

  fullHistory.push({
    role: "user",
    content: shorten(userText)
  });

  fullHistory.push({
    role: "assistant",
    content: shorten(assistantText)
  });
}








module.exports = { fullHistories, getFullHistory, shorten, logToFullHistory }
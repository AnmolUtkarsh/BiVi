const { chatHistories } = require("./api");
const { fullHistories } = require("./fullhistory");

const userHistoryPrefs = new Map();


function historyFetch(userId) {
    const his = userHistoryPrefs.get(userId);
    
    if (!his) return "History_On";
    return his.state;
}


function isHistoryEnabled(userId) {
    const his = userHistoryPrefs.get(userId);


    if (!his) return true; 

    if (his.state === "History_Off") {

        return false;
    }

    return true;
}

module.exports = {isHistoryEnabled, historyFetch, userHistoryPrefs}
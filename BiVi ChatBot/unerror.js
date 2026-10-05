const {a} = require('./test2.js')

function Error50035(value) {
    if (!value) return "No content";

    if (value.length > 2000) {
        return value.slice(0, 1990) + "...";
    }

    return value;
}

function Error50006(value) {
    // Cannot send an empty message
    if (!value || !String(value).trim()) {
        return "⚠️ Empty response received.";
    }
    return String(value);
}

function Error50013() {
    // Missing Permissions
    return "❌ I don't have permission to perform that action.";
}

function Error10008() {
    // Unknown Message
    return "❌ The target message no longer exists.";
}

function Error10003() {
    // Unknown Channel
    return "❌ The channel could not be found.";
}

function Error50001() {
    // Missing Access
    return "❌ I don't have access to that resource.";
}

function Error429() {
    // Rate limited
    return "⏳ Rate limit reached. Please try again shortly.";
}



const errorHandlers = {
    50006: Error50006,
    50035: Error50035,
    50013: Error50013,
    10008: Error10008,
    10003: Error10003,
    50001: Error50001,
    429: Error429
};

module.exports = {Error50035, errorHandlers}
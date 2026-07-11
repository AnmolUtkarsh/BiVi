// English, French, German, Hindi, Italian, Portuguese, Spanish


const LANGUAGE_TIMEOUT = 24 * 60 * 60 * 1000;

const userLanguage = new Map();

function getUserLanguage(userId) {
    const data = userLanguage.get(userId);

    if (!data) return "English";

    if (Date.now() - data.setAt >= LANGUAGE_TIMEOUT) {
        userLanguage.delete(userId);
        return "English";
    }

    return data.language;
}



const languages = {
    1: "English",
    2: "French",
    3: "Italian",
    4: "Spanish",
    5: "German",
    6: "Portuguese"
};



module.exports = { languages, getUserLanguage, userLanguage }
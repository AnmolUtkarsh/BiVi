//Round Off Function

function round(value, decimals = 2) {
    const multiplier = 10 ** decimals;

    return Math.round(
        (value + Number.EPSILON) * multiplier
    ) / multiplier;
}


//String Compulsion TypeError
function assertString(value, name) {
    if (typeof value !== "string") {
        throw new TypeError(`${name} must be a string`);
    }
}


//Clamping Function
function clamp(value, min, max) {
    return Math.min(
        max,
        Math.max(min, value)
    );
}



//Strings Words Compulsion
function getWords(text) {

    if (typeof text !== "string") {
        throw new TypeError(
            "Text must be a string"
        );
    }

    const trimmed = text.trim();

    if (trimmed === "") {
        return [];
    }

    return trimmed.split(/\s+/u);
}

//Regex Words Spaning Function

// function getWordSpans(text) {
//     const result = [];
//     const regex = /\S+/gu;
//     let match;
//     while ((match = regex.exec(text)) !== null) {
//         result.push({
//             word: match[0],
//             start: match.index,
//             end: match.index + match[0].length
//         });
//     }
//     return result;
// }


//WhiteSpace Counter v1
// function countWhitespace(text) {
//     return (text.match(/\s/gu) || []).length;
// }

//Spaces Counter Function v2
function countSpaces(text) {

    if (text.length === 0) {
        return 0;
    }
    return (text.match(/\s/gu) || []).length; //Regex provided by ChatGPT.
}


function finiteOr(value, fallback) {
    return Number.isFinite(value)
        ? value
        : fallback;
}


function smoothStep(x) {

    x = clamp(x, 0, 1);

    return (
        x * x *
        (3 - 2 * x)
    );
}

//Module Exports
module.exports = {
    round,
    assertString,
    clamp,
    getWords,
    countSpaces,
    finiteOr,
    smoothStep
}
const path = require("path");
const fs = require('fs/promises');
const { apiError } = require("./error");
const { apiResponse } = require("./response");
require("dotenv").config({
    path: path.resolve(__dirname, "../.env")
});
async function generateWords(lang, count) {
    let data
    try {
        // if (lang_word != 0) {
        //     data = await fs.readFile(
        //         path.join(__dirname, "Languages", `${lang}_${lang_word}.json`),
        //         "utf8")
        // }
        // else {
        data = await fs.readFile(
            path.join(__dirname, "Languages", `${lang}.json`),
            "utf8"
        )
        // }

        const language = JSON.parse(data);
        const words = language.words;

        const result = [];

        for (let i = 0; i < count; i++) {
            const index = Math.floor(Math.random() * words.length);
            result.push(words[index]);
        }

        return result;

    } catch (err) {
        // console.error(err);
        throw new apiError(400, "Unable to create word list")
    }
}
// (async () => {
// const result = await generateWords("english_1k", 100);
// console.log(result)
// })()


async function generateTest(db, lang, count) {
    const createdAt = Date.now()
    if (Number(count) < 10) {
        throw new apiError(400, "The entered word list count is less than the Minimum limit")
    }

    try {
        // const db = client.db("BiVi_Typing_Test");
        // db.collection("tests");

        const [counter, word_list] = await Promise.all([
            db.collection("counter").findOneAndUpdate(
                { _id: "counter" },
                { $inc: { sequence: 99 } },
                { upsert: true, returnDocument: "after" }
            ),
            generateWords(lang, count)
        ])
        if (Date.now() - createdAt > 20000) {
            throw new apiError(408, "Request timed out [Database Error]");
        }

        const testid = `BV-${String(counter.sequence).padStart(6, "0")}ii`;

        if (Date.now() - createdAt > 30000) {
            throw new apiError(408, "Request timed out [Database Error]");
        }
        try {
            await db.collection("tests")
                .insertOne
                (
                    {
                        testId: counter.sequence,
                        createdAt: new Date(),
                        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
                        status: "active",
                        lang: lang,
                        type: "words",
                        count: count,
                        result: null
                    }
                )
        }
        catch (er) {
            throw new apiError(500, "Database Crashed")
        }


        return apiResponse(testid, lang, count, word_list);
    } catch (db_error) {
        throw new apiError(
            db_error.code || 500,
            db_error.message || "Internal Server Error"
        );
    }
};







function parseLanguageIdentifier(input) {
    if (typeof input !== "string") {
        return null;
    }

    let value;

    try {
        value = decodeURIComponent(input)
            .trim()
            .toLowerCase();
    } catch {
        return null;
    }

    /*
        Allowed forms:

        english
        english1k
        english_1k
        english-1k
        english 1k

        german25k
        german_25k
        german-25k

        etc.
    */

    const match = value.match(
        /^([a-z]+)(?:[\s_-]*([0-9]+)(k|m)?)?$/
    );

    if (!match) {
        return null;
    }

    const language = match[1];

    /*
        No dataset size.
        english -> english
    */
    if (!match[2]) {
        return language;
    }

    const number = Number(match[2]);
    const unit = match[3];

    let size;

    if (unit === "k") {
        size = `${number}k`;
    } else if (unit === "m") {
        size = `${number}m`;
    } else {
        /*
            If someone writes:

            english1000

            we normalize it to:

            english_1000

            rather than treating 1000 as count.
        */
        size = String(number);
    }

    return `${language}_${size}`;
}



function parseCount(input, defaultCount = 50) {
    if (input === undefined || input === null || input === "") {
        return defaultCount;
    }

    if (typeof input !== "string" && typeof input !== "number") {
        return null;
    }

    const value = String(input)
        .trim()
        .toLowerCase();

    /*
        Accept:

        50
        1000
        1k
        5k
        1m
        2.5k
        2.5m

        Also allow separators:

        1_k
        1-k
        1 k
        1_m
    */

    const match = value.match(
        /^(\d+(?:\.\d+)?)[\s_-]*(k|m)?$/
    );

    if (!match) {
        return null;
    }

    const number = Number(match[1]);
    const unit = match[2];

    let count;

    if (unit === "k") {
        count = number * 1_000;
    } else if (unit === "m") {
        count = number * 1_000_000;
    } else {
        count = number;
    }

    /*
        A word count must ultimately be an integer.
        2.5k = 2500 is valid.
        2.55k = 2550 is also valid.
    */
    const MAX_COUNT = Number(process.env.max_char);
    if (!Number.isSafeInteger(count) || count > MAX_COUNT) {
        return null;
    }

    return count;
}



async function searchTest(testid, db) {

    let testId
    if (testid.includes("-")) {
        testId = +testid.slice(3, -2);
    }
    else {
        testId = +testid.slice(2, -2);
    }

    try {
        const output = await db.collection("tests").findOne({ testId: testId });

        if (!output) {
            return null
        }
        if (output.status === "error") {
            const error = await db
                .collection("BiVi_API_Errors_Logs")
                .findOne({
                    testId: testId
                });

            return error;
        }

        return output;


        // return res.status(200).json(result)
    } catch (err) {
        // console.error("Error:", err.message);
        throw new apiError(err.code || 500, err.message || "Internal Server Error");
    }



    // try {
    //     const db = client.db("BiVi_Typing_Test");
    //     const a = await db.collection("tests").findOne()
    //     return a;
    // } catch (error) {
    //     throw new apiError(500, "Database Crashed")
    // }
    // try{
    // This is Incomplete
    // }
}




async function updateTest(testid, db, value) {

    let testId
    if (testid.includes("-")) {
        testId = +testid.slice(3, -2);
    }
    else {
        testId = +testid.slice(2, -2);
    }

    try {
        const result = await db.collection("tests").updateOne({ testId }, {
            $set: {
                status: "completed",
                result: {
                    nWPM: value.nWPM ?? null,
                    rWPM: value.rWPM ?? null,
                    accuracy: value.accuracy ?? null,
                    consistency: value.consistency ?? null,
                    timeTaken: value.timeTaken ?? null,
                    totalChars: value.totalChars ?? null,
                    totalErrors: value.totalErrors ?? null
                }
            }
        });

        if (result.matchedCount === 0) {
            throw new apiError(404, "Test not found");
        }

        return;
        // return res.status(200).json(result)
    } catch (err) {
        // console.error("Error:", err.message);
        throw new apiError(err.code || 500, err.message || "unable to update database");
    }



    // try {
    //     const db = client.db("BiVi_Typing_Test");
    //     const a = await db.collection("tests").findOne()
    //     return a;
    // } catch (error) {
    //     throw new apiError(500, "Database Crashed")
    // }
    // try{
    // This is Incomplete
    // }
}


module.exports = { generateWords, generateTest, parseLanguageIdentifier, parseCount, searchTest, updateTest }
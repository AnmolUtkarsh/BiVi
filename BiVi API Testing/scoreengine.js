/*
===========================================================
    BIVI TYPING TEST SCORING ENGINE
===========================================================

    PURPOSE
    -------
    Deterministically calculate typing-test statistics.

    INPUT
    -----
    expected   -> canonical test text from MongoDB
    entered    -> text submitted by the client
    startedAt  -> client/server-approved start timestamp
    completedAt -> server-received completion timestamp

    IMPORTANT
    ---------
    The server must retrieve "expected" from the database.
    Do NOT trust an expected string supplied by the client.

===========================================================
*/


"use strict";


function round(value, decimals = 2) {
    const multiplier = 10 ** decimals;

    return Math.round(
        (value + Number.EPSILON) * multiplier
    ) / multiplier;
}


function assertString(value, name) {
    if (typeof value !== "string") {
        throw new TypeError(`${name} must be a string`);
    }
}


function clamp(value, min, max) {
    return Math.min(
        max,
        Math.max(min, value)
    );
}


/*
===========================================================
    Unicode-aware character handling
===========================================================

    Array.from() works by Unicode code points rather than
    raw UTF-16 code units.

    This is considerably safer than:

        string[i]

    for non-ASCII languages and emoji.

===========================================================
*/

const segmenter = new Intl.Segmenter(
    undefined,
    { granularity: "grapheme" }
);

function toCharacters(text) {
    return Array.from(
        segmenter.segment(text),
        item => item.segment
    );
}













function calculateGrossWPM(
    enteredCharacters,
    seconds
) {

    if (seconds <= 0) {
        return 0;
    }

    const minutes = seconds / 60;

    return (
        enteredCharacters / 5
    ) / minutes;
}





function calculateNetWPM(
    rawWPM,
    uncorrectedErrors,
    seconds
) {

    if (seconds <= 0) {
        return 0;
    }

    const minutes = seconds / 60;

    return Math.max(
        0,
        rawWPM -
        (uncorrectedErrors / minutes)
    );
}


function calculateAccuracy(
    correctCharacters,
    enteredCharacters
) {

    if (enteredCharacters === 0) {
        return 0;
    }

    return (
        correctCharacters /
        enteredCharacters
    ) * 100;
}


// events: [
//     74,
//     81,
//     69,
//     83,
//     77
// ]



function calculateTimingStats(keyIntervals = []) {


    if (
        !Array.isArray(keyIntervals) ||
        keyIntervals.length < 2
    ) {
        return null;
    }

    const MAX_KEY_INTERVALS = 20_000;

    if (keyIntervals.length > MAX_KEY_INTERVALS) {
        throw new Error("Too many key intervals");
    }

    const values = keyIntervals.filter(
        value =>
            Number.isFinite(value) &&
            value >= 0 &&
            value <= 5000
    );

    if (values.length < 2) {
        return null;
    }

    const sum =
        values.reduce(
            (a, b) => a + b,
            0
        );

    const average =
        sum / values.length;


    let variance = 0;

    for (const value of values) {
        variance +=
            (value - average) ** 2;
    }

    variance /= values.length;


    const standardDeviation =
        Math.sqrt(variance);


    const coefficientOfVariation =
        average === 0
            ? 0
            : standardDeviation / average;


    const consistency =
        clamp(
            100 -
            coefficientOfVariation * 100,
            0,
            100
        );


    return {

        samples:
            values.length,

        averageInterval:
            round(average, 2),

        standardDeviation:
            round(
                standardDeviation,
                2
            ),

        consistency:
            round(
                consistency,
                2
            ),

        longestInterval:
            Math.max(...values),

        shortestInterval:
            Math.min(...values)
    };
}






/*
===========================================================
    Generic Wagner-Fischer Sequence Alignment
===========================================================

    Used for BOTH:

        1. words
        2. characters inside aligned words

    Operations:

        equal
        substitute
        insert
        delete

===========================================================
*/

function alignSequences(expected, entered) {

    const MAX_TEXT_LENGTH = 10_000;

    if (
        (typeof expected === "string" &&
            expected.length > MAX_TEXT_LENGTH) ||
        (typeof entered === "string" &&
            entered.length > MAX_TEXT_LENGTH)
    ) {
        throw new Error("Text too large");
    }

    const a = Array.isArray(expected)
        ? expected
        : toCharacters(expected);

    const b = Array.isArray(entered)
        ? entered
        : toCharacters(entered);

    const n = a.length;
    const m = b.length;


    /*
    -------------------------------------------------------
        Safety limit

        Prevent attacker-controlled gigantic DP matrices.
    -------------------------------------------------------
    */

    // Safely supports up to sqrt(30,000,000) ≈ 5,477 characters per string
    const MAX_CELLS = Math.min(
        Number(process.env.MAX_ALIGNMENT_CELLS) || 30_000_000,
        30_000_000
    );

    if ((n + 1) * (m + 1) > MAX_CELLS) {
        throw new Error(
            "Sequence too large for alignment"
        );
    }

















    /*
    -------------------------------------------------------
        DP matrix

        Flat Int32Array instead of a 2D JavaScript array.

        Benefits:
        - lower memory overhead
        - contiguous memory
        - less garbage collection pressure
        - predictable 4-byte integer storage per cell
    -------------------------------------------------------
    */

    const cols = m + 1;

    const dp =
        new Int32Array(
            (n + 1) * cols
        );


    /*
    -------------------------------------------------------
        Initialize base cases
    -------------------------------------------------------
    */

    for (let i = 0; i <= n; i++) {
        dp[i * cols] = i;
    }

    for (let j = 0; j <= m; j++) {
        dp[j] = j;
    }


    /*
    -------------------------------------------------------
        Fill matrix
    -------------------------------------------------------
    */

    for (let i = 1; i <= n; i++) {

        const row =
            i * cols;

        const previousRow =
            row - cols;

        for (let j = 1; j <= m; j++) {

            const substitutionCost =
                a[i - 1] === b[j - 1]
                    ? 0
                    : 1;

            dp[row + j] =
                Math.min(

                    // substitution / equality
                    dp[previousRow + j - 1] +
                    substitutionCost,

                    // insertion
                    dp[row + j - 1] + 1,

                    // deletion
                    dp[previousRow + j] + 1
                );
        }
    }

    // /*
    // -------------------------------------------------------
    //     DP matrix
    // -------------------------------------------------------
    // */




    // const dp = Array.from(
    //     { length: n + 1 },
    //     () => new Array(m + 1)
    // );


    // for (let i = 0; i <= n; i++) {
    //     dp[i][0] = i;
    // }

    // for (let j = 0; j <= m; j++) {
    //     dp[0][j] = j;
    // }


    // /*
    // -------------------------------------------------------
    //     Fill matrix
    // -------------------------------------------------------
    // */

    // for (let i = 1; i <= n; i++) {

    //     for (let j = 1; j <= m; j++) {

    //         const substitutionCost =
    //             a[i - 1] === b[j - 1]
    //                 ? 0
    //                 : 1;

    //         dp[i][j] = Math.min(

    //             // substitution / equality
    //             dp[i - 1][j - 1] +
    //             substitutionCost,

    //             // insertion
    //             dp[i][j - 1] + 1,

    //             // deletion
    //             dp[i - 1][j] + 1
    //         );
    //     }
    // }


    /*
    -------------------------------------------------------
        Backtrack

        Tie-breaking priority:

        1. equal
        2. substitution
        3. deletion
        4. insertion

        This makes the result deterministic.
    -------------------------------------------------------
    */

    const operations = [];

    let i = n;
    let j = m;


    // while (i > 0 || j > 0) {

    //     /*
    //     -----------------------------------------------
    //         Exact equality
    //     -----------------------------------------------
    //     */

    //     if (
    //         i > 0 &&
    //         j > 0 &&
    //         a[i - 1] === b[j - 1] &&
    //         dp[i][j] === dp[i - 1][j - 1]
    //     ) {

    //         operations.push({
    //             type: "equal",
    //             expected: a[i - 1],
    //             entered: b[j - 1]
    //         });

    //         i--;
    //         j--;

    //         continue;
    //     }


    //     /*
    //     -----------------------------------------------
    //         Substitution
    //     -----------------------------------------------
    //     */

    //     if (
    //         i > 0 &&
    //         j > 0 &&
    //         dp[i][j] === dp[i - 1][j - 1] + 1
    //     ) {

    //         operations.push({
    //             type: "substitute",
    //             expected: a[i - 1],
    //             entered: b[j - 1]
    //         });

    //         i--;
    //         j--;

    //         continue;
    //     }


    //     /*
    //     -----------------------------------------------
    //         Deletion

    //         Expected exists but entered doesn't.
    //     -----------------------------------------------
    //     */

    //     if (
    //         i > 0 &&
    //         dp[i][j] === dp[i - 1][j] + 1
    //     ) {

    //         operations.push({
    //             type: "delete",
    //             expected: a[i - 1],
    //             entered: null
    //         });

    //         i--;

    //         continue;
    //     }


    //     /*
    //     -----------------------------------------------
    //         Insertion

    //         Entered exists but expected doesn't.
    //     -----------------------------------------------
    //     */

    //     if (j > 0) {

    //         operations.push({
    //             type: "insert",
    //             expected: null,
    //             entered: b[j - 1]
    //         });

    //         j--;

    //         continue;
    //     }
    // }

    while (i > 0 || j > 0) {

        /*
        -----------------------------------------------
            Exact equality
        -----------------------------------------------
        */

        if (
            i > 0 &&
            j > 0 &&
            a[i - 1] === b[j - 1] &&
            dp[i * cols + j] ===
            dp[(i - 1) * cols + (j - 1)]
        ) {

            operations.push({
                type: "equal",
                expected: a[i - 1],
                entered: b[j - 1]
            });

            i--;
            j--;

            continue;
        }


        /*
        -----------------------------------------------
            Substitution
        -----------------------------------------------
        */

        if (
            i > 0 &&
            j > 0 &&
            a[i - 1] !== b[j - 1] &&
            dp[i * cols + j] ===
            dp[(i - 1) * cols + (j - 1)] + 1
        ) {

            operations.push({
                type: "substitute",
                expected: a[i - 1],
                entered: b[j - 1]
            });

            i--;
            j--;

            continue;
        }


        /*
        -----------------------------------------------
            Deletion
        -----------------------------------------------
    
            Expected exists but entered doesn't.
        -----------------------------------------------
        */

        if (
            i > 0 &&
            dp[i * cols + j] ===
            dp[(i - 1) * cols + j] + 1
        ) {

            operations.push({
                type: "delete",
                expected: a[i - 1],
                entered: null
            });

            i--;

            continue;
        }


        /*
        -----------------------------------------------
            Insertion
        -----------------------------------------------
    
            Entered exists but expected doesn't.
        -----------------------------------------------
        */

        if (j > 0) {

            operations.push({
                type: "insert",
                expected: null,
                entered: b[j - 1]
            });

            j--;

            continue;
        }
    }


    operations.reverse();


    return {
        distance: dp[n * cols + m],
        operations
    };
}


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


// function countWhitespace(text) {
//     return (text.match(/\s/gu) || []).length;
// }

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




/*
===========================================================
    Word Alignment
===========================================================
*/

function alignWords(expected, entered) {

    const expectedWords = getWords(expected);
    const enteredWords = getWords(entered);

    return {
        expectedWords,
        enteredWords,

        ...alignSequences(
            expectedWords,
            enteredWords
        )
    };
}







/*
===========================================================
    Unified Typing Comparison
===========================================================

    WORD LEVEL
    -----------
    Used for:
        correct words
        incorrect words
        extra words
        missed words

    CHARACTER LEVEL
    ----------------
    Uses the ENTIRE original strings, including whitespace.

    This prevents:
        - word cascading
        - character cascading
        - whitespace miscounting

===========================================================
*/

function compareSequence(expected, entered) {

    /*
    -------------------------------------------------------
        WORD ALIGNMENT
    -------------------------------------------------------
    */

    const wordAlignment =
        alignWords(
            expected,
            entered
        );


    /*
    -------------------------------------------------------
        FULL CHARACTER ALIGNMENT
    -------------------------------------------------------

        IMPORTANT:
        Do this on the original strings.

        Spaces remain part of the comparison.
    -------------------------------------------------------
    */

    const characterAlignment =
        alignSequences(
            expected,
            entered
        );


    /*
    -------------------------------------------------------
        WORD STATISTICS
    -------------------------------------------------------
    */

    const wordsStats = {

        expected:
            wordAlignment.expectedWords.length,

        entered:
            wordAlignment.enteredWords.length,

        correct: 0,
        incorrect: 0,
        extra: 0,
        missed: 0,

        results: []
    };


    // for (
    //     let index = 0;
    //     index < wordAlignment.operations.length;
    //     index++
    // ) {

    //     const item =
    //         wordAlignment.operations[index];


    //     if (item.type === "equal") {
    //         wordsStats.correct++;
    //     }

    //     else if (item.type === "substitute") {
    //         wordsStats.incorrect++;
    //     }

    //     else if (item.type === "insert") {
    //         wordsStats.extra++;
    //     }

    //     else if (item.type === "delete") {
    //         wordsStats.missed++;
    //     }


    //     wordsStats.results.push({
    //         index,

    //         expected:
    //             item.expected,

    //         entered:
    //             item.entered,

    //         status:
    //             item.type
    //     });
    // }

for (
    let index = 0;
    index < wordAlignment.operations.length;
    index++
) {

    const item =
        wordAlignment.operations[index];


    if (item.type === "equal") {

        wordsStats.correct++;

    }

    else if (item.type === "substitute") {

        wordsStats.incorrect++;

    }

    else if (item.type === "insert") {

        wordsStats.extra++;

    }

    else if (item.type === "delete") {

        wordsStats.missed++;
    }


    wordsStats.results.push({

        index,

        expected:
            item.expected,

        entered:
            item.entered,

        status:
            item.type
    });
}


    /*
    -------------------------------------------------------
        CHARACTER STATISTICS
    -------------------------------------------------------
    */

    const charactersStats = {

        expected:
            toCharacters(expected).length,

        entered:
            toCharacters(entered).length,

        correct: 0,
        incorrect: 0,
        extra: 0,
        missed: 0,

        errors: [],

        firstError: null,

        longestCorrectStreak: 0,
        longestIncorrectStreak: 0
    };


    let currentCorrectStreak = 0;
    let currentIncorrectStreak = 0;


    /*
    -------------------------------------------------------
        Process character alignment
    -------------------------------------------------------
    */

    let expectedPosition = 0;
    let enteredPosition = 0;


    for (
        const operation
        of characterAlignment.operations
    ) {

        /*
        -----------------------------------------------
            CORRECT
        -----------------------------------------------
        */

        if (operation.type === "equal") {

            charactersStats.correct++;

            currentCorrectStreak++;
            currentIncorrectStreak = 0;

            charactersStats.longestCorrectStreak =
                Math.max(
                    charactersStats.longestCorrectStreak,
                    currentCorrectStreak
                );

            expectedPosition++;
            enteredPosition++;

            continue;
        }


        /*
        -----------------------------------------------
            ERROR
        -----------------------------------------------
        */

        // if (charactersStats.firstError === null) {
        //     charactersStats.firstError = {
        //         expectedPosition,
        //         enteredPosition
        //     };
        // }


        if (charactersStats.firstError === null) {

    charactersStats.firstError = {
        type: operation.type,
        expText: operation.expected ?? null,
        entText: operation.entered ?? null,
        exp: expectedPosition,
        ent: enteredPosition,
    };
}

        currentIncorrectStreak++;
        currentCorrectStreak = 0;

        charactersStats.longestIncorrectStreak =
            Math.max(
                charactersStats.longestIncorrectStreak,
                currentIncorrectStreak
            );


        /*
        -----------------------------------------------
            SUBSTITUTION
        -----------------------------------------------
        */

        if (operation.type === "substitute") {

            charactersStats.incorrect++;

            charactersStats.errors.push({
                type: "substitution",
                expText: operation.expected,
                entText: operation.entered,
                exp: expectedPosition,
                ent: enteredPosition,
            });

            expectedPosition++;
            enteredPosition++;

            continue;
        }


        /*
        -----------------------------------------------
            EXTRA CHARACTER
        -----------------------------------------------
        */
    
        if (operation.type === "insert") {

            charactersStats.extra++;

            charactersStats.errors.push({
                expectedPosition,
                enteredPosition,

                type: "extra",

                expected: null,
                entered: operation.entered
            });

            enteredPosition++;

            continue;
        }


        /*
        -----------------------------------------------
            MISSED CHARACTER
        -----------------------------------------------
        */

        if (operation.type === "delete") {

            charactersStats.missed++;

            charactersStats.errors.push({
                expectedPosition,
                enteredPosition,

                type: "missed",

                expected: operation.expected,
                entered: null
            });

            expectedPosition++;

            continue;
        }
    }


    return {

        words:
            wordsStats,

        characters:
            charactersStats,

        errors:
            charactersStats.errors
    };
}








function countSpaces(text) {

    if (text.length === 0) {
        return 0;
    }

    return (text.match(/\s/gu) || []).length;
}






function calculateWhitespaceStatistics(
    expected,
    entered
) {

    const expectedSpaces =
        countSpaces(expected);

    const enteredSpaces =
        countSpaces(entered);

    return {
        expected: expectedSpaces,
        entered: enteredSpaces
    };
}








function calculateTypingResult({
    expected,
    entered,
    durationSeconds,
    keyIntervals = [],
    clientDuration
}) {

    if (typeof expected !== "string") {
        throw new TypeError(
            "expected must be a string"
        );
    }

    if (typeof entered !== "string") {
        throw new TypeError(
            "entered must be a string"
        );
    }

    if (
        !Number.isFinite(durationSeconds) ||
        durationSeconds <= 0
    ) {
        throw new TypeError(
            "durationSeconds must be positive"
        );
    }


    /*
    =======================================================
        ALIGNMENT / SCORING
    =======================================================
    */

    const comparison =
        compareSequence(
            expected,
            entered
        );


    /*
    =======================================================
        WHITESPACE
    =======================================================
    */

    const whitespace =
        calculateWhitespaceStatistics(
            expected,
            entered
        );


    /*
    =======================================================
        RAW WPM
    =======================================================
    */

    const minutes =
        durationSeconds / 60;


    const rawWPM =
        (
            comparison.characters.entered /
            5
        ) / minutes;


    /*
    =======================================================
        ACCURACY
    =======================================================
    */

    const accuracy =
        comparison.characters.entered === 0

            ? 0

            : (
                comparison.characters.correct /
                comparison.characters.entered
            ) * 100;


    /*
    =======================================================
        UNCORRECTED ERRORS
    =======================================================

        Here we use final alignment errors.

        substitution = 1
        extra        = 1
        missed       = 1

    =======================================================
    */

    const uncorrectedErrors =
        comparison.characters.incorrect +
        comparison.characters.extra +
        comparison.characters.missed;


    /*
    =======================================================
        NET WPM
    =======================================================
    */

    const netWPM =
        Math.max(
            rawWPM,

            rawWPM -
            (
                uncorrectedErrors /
                minutes
            )
        );


    /*
    =======================================================
        CONSISTENCY
    =======================================================
    */

    const timing =
        calculateTimingStats(
            keyIntervals
        );


    /*
    =======================================================
        INTEGRITY
    =======================================================
    */

    const suspiciousReasons = [];


    if (
        clientDuration !== undefined &&
        Number.isFinite(clientDuration)
    ) {

        const difference =
            Math.abs(
                clientDuration -
                durationSeconds
            );

        if (
            difference >
            Math.max(
                5,
                durationSeconds * 0.25
            )
        ) {
            suspiciousReasons.push(
                "duration_mismatch"
            );
        }
    }


    if (rawWPM > 300) {
        suspiciousReasons.push("extreme_wpm");
    }


    /*
    =======================================================
        FINAL RESULT
    =======================================================
    */

    return {

        nWPM:
            round(netWPM, 2),

        rWPM:
            round(rawWPM, 2),

        accuracy:
            round(accuracy, 2),

        consistency:
            timing
                ? timing.consistency
                : null,

        timeTaken:
            round(
                durationSeconds,
                3
            ),


        characters: {

            expected:
                comparison.characters.expected,

            entered:
                comparison.characters.entered,

            correct:
                comparison.characters.correct,

            incorrect:
                comparison.characters.incorrect,

            extra:
                comparison.characters.extra,

            missed:
                comparison.characters.missed
        },


        words: {

            expected:
                comparison.words.expected,

            entered:
                comparison.words.entered,

            correct:
                comparison.words.correct,

            incorrect:
                comparison.words.incorrect,

            extra:
                comparison.words.extra,

            missed:
                comparison.words.missed
        },


        whitespace,


        errors: {

            uncorrected:
                uncorrectedErrors,

            firstError:
                comparison.errors[0] || null,

            totalRecorded:
                comparison.errors.length
        },


        alignment: {

            words:
                comparison.words.results,

            errors:
                comparison.errors
        },


        timing,


        integrity: {

            suspicious:
                suspiciousReasons.length > 0,

            reasons:
                suspiciousReasons
        }
    };
}

/*
===========================================================
    Word tokenizer
===========================================================

    Whitespace separates words.

    Example:

        "hello   world"

    becomes:

        ["hello", "world"]

===========================================================
*/

// function tokenizeWords(text) {
//     const trimmed = text.trim();

//     if (trimmed === "") {
//         return [];
//     }

//     return trimmed.split(/\s+/u);
// }


/*
===========================================================
    Input validation
===========================================================
*/








// console.log(calculateTypingResult({expected: "The quick brown fox jumps over the lazy dog and runs across the green field.", entered: "The quik brown fx jumps over teh lazy dog and runs across the gren field.", durationSeconds: 15.5}))
// console.dir(
//     calculateTypingResult({
//         expected: "Hello world",
//         entered: "Hello world",
//         durationSeconds: 5
//     }),
//     { depth: null }
// );


// console.dir(
//     calculateTypingResult({
//         expected: "Hello world",
//         entered: "Hello wurld",
//         durationSeconds: 5
//     }),
//     { depth: null }
// );


// console.dir(
//     calculateTypingResult({
//         expected: "Hello world",
//         entered: "Hello  world",
//         durationSeconds: 5
//     }),
//     { depth: null }
// );


// console.dir(
//     calculateTypingResult({
//         expected: "The quick brown fox jumps over the silent valley while machines calculate every uncertain movement. Precision matters when tiny mistakes accumulate across long sequences, because one misplaced character can shift every comparison that follows. Reliable software should survive chaotic input, unexpected repetition, missing fragments, accidental insertions, reversed sections, and sudden corrections without producing impossible statistics. Testing an algorithm with clean examples is useful, but deliberately hostile input reveals weaknesses that ordinary cases will never expose.",
//         entered: "The quick borwn fox jumps over the silent valley while machinse calculate every uncertain movemnt. Precision matters when tiny mistakes accumulate across long sequences, because one misplaced character can shift every comparsion that follows. Reliable software should survive chaotci input, unexpected repetition, missing fragments, accidental insertions, reversed sections, and sudden corrections without producing impossible statisitcs. Testing an algorithm with clean examples is useful, but deliberately hostile input reveals weakneses that ordinary cases will never expose.",
//         durationSeconds: 73.847
//     }),
//     { depth: null }
// );
console.dir(
    calculateTypingResult({
        expected: "The copper bridge looked unusually silent at dawn, although the river beneath it surged with relentless speed. A narrow trail curved away from the station, crossed brittle grass, and disappeared behind a weathered wall. Near the wall, three machines hummed beside a deserted shed while distant bells interrupted the otherwise steady morning. Nobody explained why the ancient clock stopped whenever clouds covered the eastern hill, but everyone remembered the pattern. Later, a sudden gust scattered",
        entered: "behind a weathered wall. Near the wall, three machiens hummed beside a deserted shed while The copper bridge looked unusually silent at dawn, although river beneath surged with clouds covered the eastern hill, but everyone remembred the pattern. Later, a sudden gust scattered disntat bells interrupted the otherwise stead morning. Nobody explained why the anicent clock stopped whenever relentless speed. A narrow trail curved away from the station, crossed britle grass, and disappeared",
        durationSeconds: 73.847
    }),
    { depth: null }
);



// function validateInput(expected, entered) {

//     if (typeof expected !== "string") {
//         throw new TypeError("Expected text must be a string");
//     }

//     if (typeof entered !== "string") {
//         throw new TypeError("Entered text must be a string");
//     }

//     if (expected.length === 0) {
//         throw new Error("Expected text cannot be empty");
//     }
// }

module.exports = {
    calculateTypingResult,

    alignSequences,
    alignWords,

    calculateGrossWPM,
    calculateNetWPM,
    calculateAccuracy,

    calculateTimingStats
};
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
// Imports
const { getWords } = require("./helper");
const { toCharacters } = require("./segmenter");



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

    const expectedChars = toCharacters(expected);
    const enteredChars = toCharacters(entered);

    const a = Array.isArray(expected)
        ? expected
        : expectedChars;

    const b = Array.isArray(entered)
        ? entered
        : enteredChars;

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


    const expectedChars = toCharacters(expected);
    const enteredChars = toCharacters(entered);
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
            expectedChars.length,

        entered:
            enteredChars.length,

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
                expectedPosition,
                enteredPosition,
                type: operation.type,
                expected: operation.expected ?? null,
                entered: operation.entered ?? null
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
                expectedPosition,
                enteredPosition,

                type: "substitution",

                expected: operation.expected,
                entered: operation.entered
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



// Exports
module.exports = {
    alignSequences,
    compareSequence,
    alignWords
}
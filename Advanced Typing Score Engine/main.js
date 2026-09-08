
// Imports:
const { compressError } = require("./error");
const { countSpaces, round, clamp } = require("./helper");
const { compareSequence } = require("./sequencer");






















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




//The most Important and Final Function
function calculateTypingResult(
    {
        expected,
        entered,
        durationSeconds,
        showDecimals = false,
        showErrors = false,
        showCharactersInfo = false,
        showWordsInfo = false,
        showAlignment = false,
        showTiming = false,
        showIntegrity = false,
        keyIntervals = [],
        clientDuration
    }
) {
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
        ALIGNMENT Aligner
    */

    const comparison =
        compareSequence(
            expected,
            entered
        );


    /*
        WHITESPACE
    */

    const whitespace =
        calculateWhitespaceStatistics(
            expected,
            entered
        );


    /*
            RAW WPM
    */

    const minutes =
        durationSeconds / 60;

    const rawWPM =
        (
            comparison.characters.entered /
            5
        ) / minutes;


    /*
        accu
    */

    const accu =
        comparison.characters.entered === 0

            ? 0

            : (
                comparison.characters.correct /
                comparison.characters.entered
            ) * 100;


    /*
    UNCORRECTED ERRORS

        Here we use final alignment errors.
        substitution = 1
        extra        = 1
        missed       = 1
    */

    const uncorrectedErrors =
        comparison.characters.incorrect +
        comparison.characters.extra +
        comparison.characters.missed;


    /*
        Normalised | NET WPM
    */

    const netWPM =
        Math.max(
            0,
            rawWPM -
            (
                uncorrectedErrors /
                minutes
            )
        );


    /*
        CONSISTENCY
    */

    const time =
        calculateTimingStats(
            keyIntervals
        );


    /*
        INTEGRITY
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
        Case Based Editing
    */

    // let [nWPM, rWPM, accuracy, timeTaken] = 0

    // let nWPM;
const realRawWPM = showDecimals
    ? Number(round(rawWPM, 2).toFixed(2))
    : Math.round(rawWPM);

const realAccuracy = showDecimals
    ? Number(round(accu, 2).toFixed(2))
    : Math.round(accu);
    
    const realNorWPM = showDecimals
        ? Number(round(netWPM, 2).toFixed(2))
        : Math.round(netWPM);

// If literally nothing typed correctly,
// mark the result as rubbish while still
// preserving the real WPM calculation.

const isRubbishInput =
    comparison.characters.entered > 0 &&
    comparison.characters.correct === 0;

const rWPM =
    isRubbishInput
        ? "💩"
        : realRawWPM;

const nWPM =
    isRubbishInput
        ? "💩"
        : realNorWPM;

const accuracy =
    isRubbishInput
        ? "🚽"
        : realAccuracy;


        // const rWPM = showDecimals
        //     ? Number(round(rawWPM, 2).toFixed(2))
            // : Math.round(rawWPM);

        // const accuracy = showDecimals
        //     ? Number(round(accu, 2).toFixed(2))
        //     : Math.round(accu);

        const timeTaken = showDecimals
            ? Number(round(durationSeconds, 3).toFixed(2))
            : Math.floor(durationSeconds);

    // let errors;
    if (showErrors) {
        var errors = {
            uncorrected:
                uncorrectedErrors,

            firstError:
                comparison.errors[0] || null,

            totalErrors:
                comparison.errors.length
        }
    }


    if (showCharactersInfo) {
        var words = {

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
        }
    }


    if (showWordsInfo) {
        var characters = {

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
        }
    }
    if (showAlignment) {
        var alignment = {

            words:
                comparison.words.results,

            errors:
                comparison.errors
        }
    }
    if (showTiming) {
        var timing = {
            ...time,
            startedAt: null,
            endedAt: null
        };
    }
    if (showIntegrity) {
        var integrity = {

            suspicious:
                suspiciousReasons.length > 0,

            reasons:
                suspiciousReasons
        }
    }
    // const [nWPM, rWPM, accu] = [nWPM, rWPM, accu]

    /*
        FINAL RESULT
    */

    return {
        nWPM,
        rWPM,
        accuracy,
        consistency:
            time
                ? time.consistency
                : null,
        timeTaken,

        // characters,
        ...(showCharactersInfo && characters),


        ...(showWordsInfo && words),


        whitespace,


        // errors,
        ...(showErrors && errors),


        ...(showAlignment && alignment),


        ...(showTiming && timing),


        ...(showIntegrity && integrity),
    };
}





module.exports = {
    calculateTypingResult,
    calculateGrossWPM,
    calculateNetWPM,
    calculateAccuracy,
    calculateTimingStats
};
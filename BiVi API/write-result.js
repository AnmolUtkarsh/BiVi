// const { apiError } = require("./error");


// async function random(req){


//     const testId = req.body.testId;
//     const expected = req.body.testText;
//     const entered = req.body.typedText;
//     const startedAt = req.body.startedAt;
//     const completedAt = req.body.completedAt;

//     if(!testId){
//         throw new apiError(400, "'testId' field not present")
//     }
//     if(!expected){
//         throw new apiError(400, "'testText' field not present")
//     }
//     if(!entered){
//         throw new apiError(400, "'typedText' field not present")
//     }
//     if(!startedAt){
//         throw new apiError(400, "'startAt' field not present")
//     }
//     if(!completedAt){
//         throw new apiError(400, "'completedAt' field not present")
//     }



// }






// writeResult.js

const { calculateTypingResult } = require("../Advanced Typing Score Engine/main");
const { apiError } = require("./error");
// const { formatWriteResultError } = require("./writeResultError");

async function tester(body, db) {

    /*
    =======================================================
        REQUEST BODY
    =======================================================
    */

    // const body = req.body;

    if (
        body === null ||
        typeof body !== "object" ||
        Array.isArray(body)
    ) {
        throw new apiError(400, "Invalid request body");
    }


    /*
    =======================================================
        EXTRACT
    =======================================================
    */

    const testid = body.testId;
    const expected = body.testText;
    const entered = body.typedText;
    const startedAt = body.startedAt;
    const completedAt = body.completedAt;
    // const durationSeconds = body.durationSeconds;
    let durationSeconds;

    const hasDurationSeconds =
        body.durationSeconds !== undefined &&
        body.durationSeconds !== null;

    const hasStartedAt =
        startedAt !== undefined &&
        startedAt !== null;

    const hasCompletedAt =
        completedAt !== undefined &&
        completedAt !== null;



    if (hasDurationSeconds) {

        // durationSeconds was provided
        if (
            typeof body.durationSeconds !== "number" ||
            !Number.isFinite(body.durationSeconds) ||
            body.durationSeconds < 0
        ) {
            throw new apiError(
                400,
                "'durationSeconds' must be a valid non-negative number"
            );
        }

        // Don't allow both forms at the same time
        if (hasStartedAt || hasCompletedAt) {
            throw new apiError(
                400,
                "Provide either 'durationSeconds' or 'startedAt' and 'completedAt', not both"
            );
        }

        durationSeconds = body.durationSeconds;

    } else {

        // durationSeconds was NOT provided
        // Therefore BOTH timestamps are required

        if (!hasStartedAt || !hasCompletedAt) {
            throw new apiError(
                400,
                "Provide either 'durationSeconds' or both 'startedAt' and 'completedAt'"
            );
        }

        if (
            typeof body.startedAt !== "string" ||
            body.startedAt.trim() === ""
        ) {
            throw new apiError(
                400,
                "'startedAt' must be a valid date"
            );
        }

        if (
            typeof body.completedAt !== "string" ||
            body.completedAt.trim() === ""
        ) {
            throw new apiError(
                400,
                "'completedAt' must be a valid date"
            );
        }

        const startTime = new Date(body.startedAt);
        const completionTime = new Date(body.completedAt);

        if (Number.isNaN(startTime.getTime())) {
            throw new apiError(
                400,
                "'startedAt' must be a valid date"
            );
        }

        if (Number.isNaN(completionTime.getTime())) {
            throw new apiError(
                400,
                "'completedAt' must be a valid date"
            );
        }

        if (completionTime < startTime) {
            throw new apiError(
                400,
                "'completedAt' cannot be earlier than 'startedAt'"
            );
        }

        durationSeconds =
            (completionTime.getTime() - startTime.getTime()) / 1000;
    }
    /*
    =======================================================
        testId
    =======================================================
    */

    if (typeof testid !== "string" || testid.trim() === "") {
        throw new apiError(
            400,
            "'testId' field not present"
        );
    }

    if (!testid) {
        throw new apiError(400, "'testId' field not present")
    }
    if (!expected) {
        throw new apiError(400, "'testText' field not present")
    }
    if (!entered) {
        throw new apiError(400, "'typedText' field not present")
    }



    // if ((!durationSeconds) || (!startedAt && !completedAt)) {
    //     throw new apiError(400, "'startAt' field not present")
    // }
    // if () {
    //     throw new apiError(400, "'completedAt' field not present")
    // }
    /*
    =======================================================
        testText
    =======================================================
    */

    if (typeof expected !== "string") {
        throw new apiError(
            400,
            "'testText' field not present"
        );
    }

    if (expected.length === 0) {
        throw new apiError(
            400,
            "'testText' cannot be empty"
        );
    }


    /*
    =======================================================
        typedText
    =======================================================
    */

    /*
        Empty string IS VALID.

        Example:
            typedText: ""

        means the user submitted without typing anything.
    */

    if (typeof entered !== "string") {
        throw new apiError(
            400,
            "'typedText' field not present"
        );
    }


    /*
    =======================================================
        startedAt
    =======================================================
    */

    // if (typeof startedAt !== "string" || startedAt.trim() === "") {
    //     throw new apiError(
    //         400,
    //         "'startedAt' field not present"
    //     );
    // }

    // const startTime = new Date(startedAt);

    // if (Number.isNaN(startTime.getTime())) {
    //     throw new apiError(
    //         400,
    //         "'startedAt' must be a valid date"
    //     );
    // }


    /*
    =======================================================
        completedAt
    =======================================================
    */

    // if (
    //     typeof completedAt !== "string" ||
    //     completedAt.trim() === ""
    // ) {
    //     throw new apiError(
    //         400,
    //         "'completedAt' field not present"
    //     );
    // }

    // const completionTime = new Date(completedAt);

    // if (Number.isNaN(completionTime.getTime())) {
    //     throw new apiError(
    //         400,
    //         "'completedAt' must be a valid date"
    //     );
    // }





    /*
    =======================================================
        TEST LOOKUP
    =======================================================

        Replace this with your actual DB function.

        Example return:

        {
            status: "success",
            test: {...}
        }

        OR

        {
            status: "error",
            code: 500,
            message: "Database error"
        }
    =======================================================
    */
    let testId
    if (testid.includes("-")) {
        testId = +testid.slice(3, -2);
    }
    else {
        testId = +testid.slice(2, -2);
    }
    try {
        // const db = client.db("BiVi_Typing_Test");
        // db.collection("tests");

        const testResult = await db.collection("tests").findOne(
            { testId: testId }
        )

        if (testResult?.status === "error") {
            throw new apiError(
                406,
                `the testId: ${testId} was Errored while generating`
            );
        }

        /*
        =======================================================
        DATABASE ERROR
    =======================================================
    */

        // if (testResult?.status === "error") {
        //     return formatWriteResultError(testResult);
        // }


        /*
        =======================================================
            TEST NOT FOUND
            =======================================================
            */

        if (!testResult) {
            throw new apiError(
                404,
                "Test not found"
            );
        }


        /*
        =======================================================
        ACTIVE TEST CHECK
        =======================================================
        */

        if (testResult.status !== "active") {
            throw new apiError(
                409,
                "Test is not active"
            );
        }


        /*
        =======================================================
        RETURN
        =======================================================
        */

        const showDecimals = body.showDecimals;
        const showErrors = body.showErrors;
        const showCharactersInfo = body.showCharactersInfo;
        const showWordsInfo = body.showWordsInfo;
        const showAlignment = body.showAlignment;
        const showTiming = body.showTiming;
        const showIntegrity = body.showIntegrity;
        const keyIntervals = body.keyIntervals;
        const clientDuration = body.clientDuration;


        const final_output = calculateTypingResult({
            expected,
            entered,
            durationSeconds,
            showDecimals,
            showErrors,
            showCharactersInfo,
            showWordsInfo,
            showAlignment,
            showTiming,
            showIntegrity,
            keyIntervals,
            clientDuration
        })


        return final_output;



    } catch (eror) {
        throw new apiError(
            eror.code || 500,
            eror.message || "Internal Server Error"
        );
    }
}


module.exports = { tester };






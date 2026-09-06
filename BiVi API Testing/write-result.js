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

const { formatWriteResultError } = require("./writeResultError");

async function random(req) {

    /*
    =======================================================
        REQUEST BODY
    =======================================================
    */

    const body = req.body;

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

    const testId = body.testId;
    const expected = body.testText;
    const entered = body.typedText;
    const startedAt = body.startedAt;
    const completedAt = body.completedAt;


    /*
    =======================================================
        testId
    =======================================================
    */

    if (typeof testId !== "string" || testId.trim() === "") {
        throw new apiError(
            400,
            "'testId' field not present"
        );
    }


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

    if (typeof startedAt !== "string" || startedAt.trim() === "") {
        throw new apiError(
            400,
            "'startedAt' field not present"
        );
    }

    const startTime = new Date(startedAt);

    if (Number.isNaN(startTime.getTime())) {
        throw new apiError(
            400,
            "'startedAt' must be a valid date"
        );
    }


    /*
    =======================================================
        completedAt
    =======================================================
    */

    if (
        typeof completedAt !== "string" ||
        completedAt.trim() === ""
    ) {
        throw new apiError(
            400,
            "'completedAt' field not present"
        );
    }

    const completionTime = new Date(completedAt);

    if (Number.isNaN(completionTime.getTime())) {
        throw new apiError(
            400,
            "'completedAt' must be a valid date"
        );
    }


    /*
    =======================================================
        TIME VALIDATION
    =======================================================
    */

    if (completionTime.getTime() < startTime.getTime()) {
        throw new apiError(
            400,
            "'completedAt' cannot be earlier than 'startedAt'"
        );
    }


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

    const testResult = await findTest(testId);


    /*
    =======================================================
        DATABASE ERROR
    =======================================================
    */

    if (testResult?.status === "error") {
        return formatWriteResultError(testResult);
    }


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

    return {
        testId,
        expected,
        entered,
        startedAt: startTime,
        completedAt: completionTime
    };
}


module.exports = random;









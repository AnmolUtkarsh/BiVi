const path = require("path");
const statuses = require("statuses");
const crypto = require("crypto");
require("dotenv").config({
    path: path.resolve(__dirname, "../.env")
});

class apiError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.code = statusCode;
        this.status = statuses.message[statusCode];
        this.message = message;
    }
}

async function customError(error, req, res, next) {
    // const error = new apiError(code, message);
    const errorId = crypto.randomUUID();
    const code = error.code || 500;
    const createdAt = new Date();

    const counter = await req.db.collection("counter").findOneAndUpdate(
        { _id: "counter" },
        { $inc: { sequence: 99 } },
        { upsert: true, returnDocument: "after" }
    )

    const testid = String(counter.sequence).padStart(6, "0");




    const errorData1 = {
        errorId,
        testId: testid,
        status: "error"
    }


    const errorData = {
        errorId,
        testId: testid,
        createdAt,
        ExpiryAt: new Date(Date.now() + 48 * 60 * 60 * 1000),
        status: "error",
        code: code,
        status: error.status || statuses.message[code],
        message: error.message || "Internal Server Error"
    }

    // req.db
    //     .collection("BiVi_API_Errors_Logs")
    //     .insertOne(errorData)
    //     .catch((dbError) => {
    //         console.error("Failed to save error:", dbError);
    //     });

    // req.db.collection("tests")
    //     .insertOne(errorData1)
    //     .catch((dbError1) => {
    //         console.error("Failed to save error in TESTs:", dbError1);
    //     });


    Promise.allSettled([
        req.db.collection("BiVi_API_Errors_Logs").insertOne(errorData),
        req.db.collection("tests").insertOne(errorData1)
    ]).then((results) => {
        for (const result of results) {
            if (result.status === "rejected") {
                console.error("Failed to save error log:", result.reason);
            }
        }
    });

    return res
        .status(code)
        .json(
            [
                {
                    status: {
                        "success": false,
                        code: code,
                    }
                }
                ,
                {
                    "space": {
                        name: "BiVi Typing Test",
                        version: process.env.bivi_tta_version
                    },
                    "error": errorData
                }

            ]
        )
}




























async function customError1(error, req, res, next) {
    // const error = new apiError(code, message);
    const code = error.code || 500;
    const errorData = {
        errorId,
        testId: testid,
        status: "error",
        code: code,
        status: error.status || statuses.message[code],
        message: error.message || "Internal Server Error"
    }

    return res
        .status(code)
        .json(
            [
                {
                    status: {
                        success: false,
                        found: false,
                        code: code,
                    }
                },
                {
                    space:
                    {
                        name: "BiVi Typing Test Find API",
                        version: process.env.bivi_ttfa_version
                    },
                    test: errorData
                }
            ]
        )
}

// function error_negative_input() {
//     return {
//         "success": false,
//         "error": {
//             "code": 411,
//             "status": statuses.message['411'],
//             "message": "Amount must be a positive integer"
//         }
//     }
// }
// function error_invalid_input() {
//     return {
//         "success": false,
//         "error": {
//             "code": 400,
//             "status": statuses.message['400'],
//             "message": "Enter valid input"
//         }
//     }
// }
// function error_rate_limit() {
//     return {
//         "success": false,
//         "error": {
//             "code": "429",
//             "status": statuses.message['429'],
//             "message": "Rate limit crossed"
//         }
//     }
// }
// function error_database_crashed() {
//     return {
//         "success": false,
//         "error": {
//             "code": 500,
//             "status": statuses.message['500'],
//             "message": "Database crashed"
//         }
//     }
// }

module.exports = { apiError, customError , customError1}
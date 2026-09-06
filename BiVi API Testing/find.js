const path = require("path");
require("dotenv").config({
    path: path.resolve(__dirname, "../.env")
});

//Status: Active, Expired, Completed, Error!

function apiFindResponse(testId, input) {
    const hmm = input.result
    return [
        {
            status: {
                success: true,
                found: true,
                code: 302,
            }
        },
        {
            space:
            {
                name: "BiVi Typing Test Find API",
                version: process.env.bivi_ttfa_version
            },
            test:
            {
                id: testId,
                status: input.status,
                createdAt: input.createdAt,
                type: input.type,
                language: input.lang,
                count: input.count,
                result: hmm ? {
                    nWPM: hmm.nWPM,
                    rWPM: hmm.rWPM,
                    accuracy: hmm.accuracy,
                    consistency: hmm.consistency ?? "UnRecorded"
                } : null
            }
        }
    ]
}







function apiFindResponseFailed(testId, input = null) {
    // const hmm = input.result
    return [
        {
            status: {
                success: true,
                found: false,
                code: 404,
            }
        },
        {
            space:
            {
                name: "BiVi Typing Test Find API",
                version: process.env.bivi_ttfa_version
            },
            test:
            {
                id: testId,
                status: input.status || null,
                createdAt: input.createdAt || null,
                type: "words" || null,
                language: language || null,
                count: count || null,
                result: hmm ? {
                    nWPM: hmm.nWPM,
                    rWPM: hmm.rWPM,
                    accuracy: hmm.accuracy,
                    consistency: hmm.consistency ?? "UnRecorded"
                } : null
            }
        }
    ]
}

module.exports = { apiFindResponse, apiFindResponseFailed }
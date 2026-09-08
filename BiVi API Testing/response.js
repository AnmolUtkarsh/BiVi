const path = require("path");
require("dotenv").config({
    path: path.resolve(__dirname, "../.env")
});
function apiResponse(testId, language, count, words) {
    return [
        {
            status: {
                success: true,
                code: 200,
            }
        },
        {
            space:
            {
                name: "BiVi Typing Test API",
                version: process.env.bivi_tta_version
            },
            test:
            {
                id: testId,
                createdAt: new Date(),
                type: "words",
                language: language,
                count: count,
                words: words
            }
        }
    ]
}
// console.log(response("english", "20"))



// function response(language, words) {
//     return [
//         {
//             platform: [
//                 {
//                     name: "BiVi Typing Test",
//                     version: "v1"
//                 }
//             ],
//             test: [
//                 {
//                     testno: 928343,
//                     type: "Words",
//                     language: "language",
//                     words: "15"
//                 },
//                 {
//                     list: words
//                 }
//             ]

//         }
//     ]
// }


function apiWriteResponse(testId, result) {
    
    return {
        status: {
            success: true,
            code: 200,
        },

        space: {
            name: "BiVi Typing Test Write-Result API",
            version: process.env.bivi_tta_version
        },

        test: {
            id: testId,
            ...result
        }
    };
}



module.exports = { apiResponse, apiWriteResponse }
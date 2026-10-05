// const path = require("path");
// require("dotenv").config({
//     path: path.resolve(__dirname, "../.env")
// });
// console.log(process.env.PORT)



// const express = require ('express')
// const app = express();

// app.use(express());

// app.post("/yes/yes", (req, res, next)=>{
//     console.log(req);
//     return res.status(200);
// })

// app.listen(6000)


(async () => {
    const a = await fetch(
        "https://finisher-placidly-proud.ngrok-free.dev/yes/yes",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: {
                testId: "Value",
                expected: [
                    "owuer",
                    "ksjdf"
                ],
                entered: [
                    "owuer",
                    "ksjdf"
                ]
            }
        }
    );

    console.log(a.status);
})();
const express = require('express');
const app = express();
const path = require("path");
const { connectDB } = require('./db.js');
const { apiError, customError, customError1, customError2 } = require('./error.js');
const { generateTest, parseLanguageIdentifier, parseCount, searchTest, updateTest } = require('./backend.js');
const { apiFindResponseFailed, apiFindResponse } = require('./find.js');
const { tester } = require('./write-result.js');
const { apiWriteResponse } = require('./response.js');

require("dotenv").config({
    path: path.resolve(__dirname, "../.env")
});

app.use(express.json());

(async function startServer() {
    const clint = await connectDB();

    const db = clint.db("BiVi_Typing_Test");
    await db.collection("tests").createIndex(
        { testId: 1 },
        { unique: true }
    );

    app.use((req, res, next) => {
        req.db = db;
        next();
    });
    // const typingRouter = express.Router();
    // const findRouter = express.Router();
    app.get("/api/typing-test/:version/:lang", async (req, res, next) => {

        const { version, lang } = req.params
        const count = parseCount(req.query.count);

        if (count === null) {
            return next(
                new apiError(
                    400,
                    "Invalid word count"
                )
            );
        }

        if (version !== process.env.bivi_tta_version) {
            return next(new apiError(
                400,
                `Deprecated/unsupported API version (use Version: ${process.env.bivi_tta_version})`
            ));
        }
        try {
            const parsedLang = parseLanguageIdentifier(lang);

            if (!parsedLang) {
                return next(
                    new apiError(
                        400,
                        "Invalid language identifier"
                    )
                );
            }
            // const output2 = parseCount
            const result = await generateTest(db, parsedLang, count);
            return res.status(200).json(result)
        } catch (err) {
            console.error("Error:", err.message);
            next(
                new apiError(
                    err.code || 500,
                    err.message || "Internal Server Error"
                )
            );
        }


    })
    app.use(customError);

    app.get("/api/typing-test/:version/find/:testId", async (req, res, next) => {

        const { version } = req.params

        if (version !== process.env.bivi_tta_version) {
            return next(new apiError(
                400,
                `Deprecated/unsupported API version (use Version: ${process.env.bivi_tta_version})`
            ));
        }
        const testid = req.params.testId


        try {
            const output_new = await searchTest(testid, db)

            if (!output_new) { //null one
                return res.status(404).json(apiFindResponseFailed(testid))
            }

            if (output_new.status === "error") { //null two
                return res.status(404).json(apiFindResponseFailed(testid, output_new))
            }

            return res.status(200).json(apiFindResponse(testid, output_new))

        } catch (erro) {
            next(new apiError(
                erro.code || 500,
                erro.message || "Internal Server Error"
            ));
        }
    })

    app.use(customError1);

    app.get("/api/typing-test/:version/write-result", async (req, res, next) => {
        const { version } = req.params
        if (version !== process.env.bivi_tta_version) {
            return next(new apiError(
                400,
                `Deprecated/unsupported API version (use Version: ${process.env.bivi_tta_version})`
            ));
        }

        next(new apiError(405, "Please make request with method: POST to this URL Endpoint"))
    })

    app.post("/api/typing-test/:version/write-result", async (req, res, next) => {
        const body = req.body;
        // const backup_timing = new Date();
        const { version } = req.params
        const testid = req.body.testId;
        // const count = parseCount(req.query.count);

        // if (count === null) {
        //     return next(
        //         new apiError(
        //             400,
        //             "Invalid word count"
        //         )
        //     );
        // }

        if (version !== process.env.bivi_tta_version) {
            return next(new apiError(
                400,
                `Deprecated/unsupported API version (use Version: ${process.env.bivi_tta_version})`
            ));
        }


        try {
            const output_final = await tester(body, db)
            if (!output_final) {
                return next(new apiError(
                    400,
                    "Unable to get Output!"
                ));
            }
            await updateTest(testid, db, output_final)
            return res.status(200).json(apiWriteResponse(testid, output_final))



        } catch (err) {
            console.error("Error:", err.message);
            next(new apiError(err.code || 500, err.message || "Internal Server Error"));
        }
    }

    )
    
    app.use(customError2);



    app.listen(process.env.PORT_BiVi, () => {
        console.log(`The Server is Working on Port Number: ${process.env.PORT_BiVi}`)

    });
})();

process.on("SIGTERM", () => {
    console.log("Received SIGTERM");
    // client.destroy();
    process.exit(0);
});

process.on("SIGINT", () => {
    console.log("Closing Server")
    console.log("Exiting")
    //   client.destroy()
    process.exit(0);
})
process.on("unhandledRejection", (reason) => {
    console.error(reason);
});
process.on("uncaughtException", (err) => {
    console.error(err);
});
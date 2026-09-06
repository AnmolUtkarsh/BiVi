// writeResultError.js

function formatWriteResultError(error) {

    if (
        error === null ||
        typeof error !== "object" ||
        Array.isArray(error)
    ) {
        return {
            status: "error",
            code: 500,
            message: "Unable to process test result"
        };
    }


    const code =
        Number.isInteger(error.code) &&
        error.code >= 400 &&
        error.code <= 599
            ? error.code
            : 500;


    const message =
        typeof error.message === "string" &&
        error.message.trim() !== ""
            ? error.message
            : "Unable to process test result";


    return {
        status: "error",
        code,
        message
    };
}


module.exports = {
    formatWriteResultError
};
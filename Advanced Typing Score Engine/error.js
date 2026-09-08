function compressError(error) {
    if (!error) {
        return null;
    }

    return {
        p: error.expectedPosition,
        i: error.enteredPosition,
        t: error.type,
        e: error.expected,
        v: error.entered
    };
}


//Exports
module.exports = { compressError }
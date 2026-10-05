const statuses = require("statuses");

// class apiError extends Error {
//     constructor(status, message) {
//         super(message);
//         this.status = status;
//     }
// }
class apiError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.code = statusCode;
        this.status = statuses.message[statusCode];
        this.message = message;
    }
}
try{
throw new apiError("429", "I don't know why this error came.")
}catch(error){
    console.log(error)
    console.log(error.code)
    console.log(error.message)
    console.log(error.status)
    // console.log(error.code)

}
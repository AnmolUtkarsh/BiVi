//Imports
const { calculateTypingResult } = require("../main");







// console.log(calculateTypingResult({expected: "The quick brown fox jumps over the lazy dog and runs across the green field.", entered: "The quik brown fx jumps over teh lazy dog and runs across the gren field.", durationSeconds: 15.5}))
// console.dir(
//     calculateTypingResult({
//         expected: "Hello world",
//         entered: "Hello world",
//         durationSeconds: 5
//     }),
//     { depth: null }
// );













console.dir(
    calculateTypingResult({
        expected: "Hello world",
        entered: "Hello wurld",
        durationSeconds: 5
    }),
    { depth: null }
);
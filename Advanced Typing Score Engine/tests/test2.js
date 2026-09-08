//Imports
const { calculateTypingResult } = require("../main");


// const a = true
let a, b = true;
console.dir(
    calculateTypingResult({
        expected: "system which present from child small could great after child plan the between feel during head follow during get before hold up long home present mean like these great you person have people nation under around than new you right want life you then seem consider people line find not",
        entered: "system which present from child small could great after child plan the between feel during head follow during get before hold up long home present mean like these great you person have people nation under around than new you right wan life you then seem consider people line find not",
        durationSeconds: 25.92, showErrors:b
    }),
    { depth: null }
);

// (async () => {
//     const a = await fetch(
//         "https://finisher-placidly-proud.ngrok-free.dev/api/typing-test/v1/write-result",
//         {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json"
//             },
//             body: JSON.stringify({
//                 testId: "BV-000594ii",
//                 testText: "system which present from child small could great after child plan the between feel during head follow during get before hold up long home present mean like these great you person have people nation under around than new you right want life you then seem consider people line find not",
//                 typedText: "system which present from child small could great after child plan the between feel during head follow during get before hold up long home present mean like these great you person have people nation under around than new you right wan life you then seem consider people line find not",
//                 durationSeconds: 25.92
//             })
//         }
//     );

//     console.log(await a.json());
// })();




// (async () => {
//     const b = await fetch(
//         "https://bivi.online/api/typing-test/v1/english"
//     );

//     // console.log("GET status:", b.status);
//     const c = await b.json();
//     const testId = c?.[1]?.test?.id

//     console.log('Got now, now proceeding)')
//     const a = await fetch(
//         "https://finisher-placidly-proud.ngrok-free.dev/api/typing-test/v1/write-result",
//         {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json"
//             },
//             body: JSON.stringify({
//                 testId: testId,
//                 testText: "system which present from child small could great after child plan the between feel during head follow during get before hold up long home present mean like these great you person have people nation under around than new you right want life you then seem consider people line find not",
//                 typedText: "system which present from child small could great after child plan the between feel during head follow during get before hold up long home present mean like these great you person have people nation under around than new you right wan life you then seem consider people line find not",
//                 durationSeconds: 25.92
//             })
//         }
//     );

//     console.log(await a.json());
// })();



(async () => {
    try {
        const b = await fetch(
            "https://finisher-placidly-proud.ngrok-free.dev/api/typing-test/v1/english"
        );

        const c = await b.json();

        console.log("GET response:", c);

        const testId = c?.[1]?.test?.id;

        console.log("Test ID received:", testId);
        console.log("Got now, now proceeding");

        const a = await fetch(
            "https://finisher-placidly-proud.ngrok-free.dev/api/typing-test/v1/write-result",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    testId,
                    testText:
                        "system which present from child small could great after child plan the between feel during head follow during get before hold up long home present mean like these great you person have people nation under around than new you right want life you then seem consider people line find not",
                    typedText:
                        "system which present from child small could great after child plan the between feel during head follow during get before hold up long home present mean like these great you person have people nation under around than new you right wan life you then seem consider people line find not",
                    durationSeconds: 25.92
                })
            }
        );

        console.log("POST status:", a.status);
        console.log("POST response:", await a.json());

    } catch (err) {
        console.error("Request failed:", err);
    }
})();
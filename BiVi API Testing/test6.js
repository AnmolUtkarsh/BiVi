(async () => {
    try {
        const b = await fetch(
            "https://finisher-placidly-proud.ngrok-free.dev/api/typing-test/v1/find/BV-001287ii"
        );
        const response =await b.json()
        console.log(response?.[1]?.test?.result)
    } catch (err) {
        console.error("Request failed:", err);
    }
})();
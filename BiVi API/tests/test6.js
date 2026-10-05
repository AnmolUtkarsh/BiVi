(async () => {
    try {
        const b = await fetch(
            "https://bivi.online/api/typing-test/v1/find/BV-004851ii"
        );
        const response =await b.json()
        console.log(response?.[1]?.test?.result)
    } catch (err) {
        console.error("Request failed:", err);
    }
})();
require("dotenv").config();

app.get("/auth/instagram/callback", async (req, res) => {
    try {
        const code = req.query.code;

        if (!code) {
            return res.status(400).send("No authorization code received.");
        }

        console.log("Authorization Code:");
        console.log(code);

        // Step 1: Exchange code for short-lived token
        const shortResponse = await fetch(
            "https://api.instagram.com/oauth/access_token",
            {
                method: "POST",
                body: new URLSearchParams({
                    client_id: process.env.INSTAGRAM_APP_ID,
                    client_secret: process.env.INSTAGRAM_APP_SECRET,
                    grant_type: "authorization_code",
                    redirect_uri: "https://bivi.online/auth/instagram/callback",
                    code: code,
                }),
            }
        );

        const shortData = await shortResponse.json();

        console.log("\nShort-lived Token Response:");
        console.log(shortData);

        if (shortData.error_type || shortData.error) {
            return res.status(400).json(shortData);
        }

        // Step 2: Exchange for 60-day token
        const longResponse = await fetch(
            `https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=2ca793d1c9ad4dbdb903a7bdf464c5cf&access_token=${shortData.access_token}`
        );

        const longData = await longResponse.json();

        console.log("\nLong-lived Token Response:");
        console.log(longData);

        res.json({
            authorization_code: code,
            short_lived_token: shortData,
            long_lived_token: longData
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: err.message
        });
    }
});
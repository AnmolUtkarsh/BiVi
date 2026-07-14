const express = require('express')
const path = require('path')
const app = express()

const PORT = 5000;

app.use(express.static(__dirname));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/terms-and-conditions", (req, res) => {
    res.sendFile(path.join(__dirname, "tac.html"));
});

app.get("/privacy-policy", (req, res) => {
    res.sendFile(path.join(__dirname, "pp.html"));
});

app.get("/coming-soon", (req, res) => {
    res.sendFile(path.join(__dirname, "coming.html"));
});

app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, "error.html"));
});

app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`);
});
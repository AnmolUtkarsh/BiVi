const express = require('express')
const path = require('path')
const app = express()

const PORT = 5000;


app.get("/", (req, res)=>{
    res.status(200).sendFile(path.join(__dirname, 'index.html'))
})

app.get("/terms-and-conditions", (req, res)=>{
    res.status(200).sendFile(path.join(__dirname, 'tac.html'))
})

app.get("/privacy-policy", (req, res)=>{
    res.status(200).sendFile(path.join(__dirname, 'pp.html'))
})

app.get("/coming-soon", (req, res)=>{
    // res.status(200).sendFile(path.join(__dirname, 'pp.html'))
    res.status(200).sendFile(path.join(__dirname, 'coming.html'))
})

app.get("/", (req, res)=>{
    res.status(200).sendFile(path.join(__dirname, 'index.html'))
})


app.get("*", (req, res)=>{
    res.status(404).sendFile(path.join(__dirname, 'error.html'))
})

app.listen(PORT, ()=>{
    console.log("App Listening on PORT:", PORT);
})
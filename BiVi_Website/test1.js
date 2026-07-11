const express = require('express')
const path = require('path')
const app = express()

const PORT = 5000;
app.get("/", (req, res)=>{
    res.sendFile("http://127.0.0.1:3000/BiVi_Website/index.html")
})

app.listen(PORT, ()=>{
    console.log("App Listening on PORT:", PORT);
})
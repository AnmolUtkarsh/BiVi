// const path = require("path");
// require("dotenv").config({
//     path: path.resolve(__dirname, "../.env")
// });
// console.log(process.env.PORT)



const express = require ('express')
const app = express();

app.use(express.json());

app.post("/yes/yes", (req, res, next)=>{
    console.log(req.headers.authorization);
    console.log(req.method);
    return res.status(200).json({ success: true });
})

app.listen(6000)
const path = require("path");
require("dotenv").config({
    path: path.resolve(__dirname, "../.env")
});

const { MongoClient } = require('mongodb')
const uri = process.env.MongoDB_URI;

async function connectDB() {
    const client = new MongoClient(uri)
    await client.connect();
    console.log("MongoDB connected to PORT:", process.env.MongoDB_URI);
    return client;
}


async function startServer(app) {
    const client = await connectDB();


    app.listen(process.env.PORT_BiVi, () => {
        console.log(`The Server is Working on Port Number: ${process.env.PORT_BiVi}`)

    });
    return client;
}

module.exports = { connectDB, startServer }
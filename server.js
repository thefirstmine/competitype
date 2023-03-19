// Server backend (only purpose is to serve the scores)
require("dotenv").config()

const express = require("express")
const app = express()
const port = process.env.PORT

app.use(express.static(__dirname + "/src"));
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/src/index.html")
})

const mongoose = require('mongoose')
mongoose.connect(process.env.MONGODB,{
  useUnifiedTopology: true,
  useNewUrlParser: true
}).then(console.log("Connected to MongoDB!"))
  .catch(console.error())

const scoreSchema = new mongoose.Schema({
    name: String,
    score: Number,
})

app.use(express.json());
app.post("/api", (req, res) => {
    res.send({message: "Received."})
    console.log("Got a POST request!")
    console.log(req.body)
    const Score = mongoose.model("score", scoreSchema)
    new Score({
        name: req.body.name,
        score: req.body.score,
    }).save().then(console.log("Saved to MongoDB!"))
})
app.get("/api", (req, res) => {
    const Score = mongoose.model("score", scoreSchema)
    Score.find().sort({ score: -1 }).then((data) => {
        res.send(data)
    })
})

app.listen(port, () => {
    console.log(`Site is listening on port ${port}`)
})
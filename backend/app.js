const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const mongoose = require('mongoose')
const postsRoutes = require('./routes/posts')
const userRoutes = require('./routes/user')
const path = require('path')



mongoose.connect("mongodb+srv://karthikb1903:" + process.env.MONGO_ATLAS_PASS +"@cluster0.q0tezns.mongodb.net/node-angular?retryWrites=true&w=majority")
    .then(() => {
        console.log("Connected to database");
    })
    .catch(() => {
        console.log("Connection error!");
    })

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization")
    res.setHeader("Access-Control-Allow-Methods", "GET, PUT, POST, PATCH, DELETE, OPTIONS")
    next()
})

app.use(bodyParser.json())

app.use("/images", express.static(path.join("backend/images")))

app.use("/api/posts",postsRoutes)
app.use("/api/user", userRoutes)

module.exports = app
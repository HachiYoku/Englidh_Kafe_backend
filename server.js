const express = require('express')
require('dotenv').config();

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

const connectDB = require("./config/dbConnection");
connectDB();

const authRoutes = require('./routes/auth')
app.use('/auth', authRoutes)

const userRoutes = require('./routes/user')
app.use('/user', userRoutes)

app.get('/', (req, res) => {
  res.send('Hello English Kafe!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
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

const courseRoutes = require('./routes/course')
app.use('/courses', courseRoutes)

const lessonRoutes = require('./routes/lesson')
app.use('/lessons', lessonRoutes)

const paymentRoutes = require('./routes/payment')
app.use('/payments', paymentRoutes)

const enrollmentRoutes = require('./routes/enrollment')
app.use('/enrollments', enrollmentRoutes)

const blogRoutes = require('./routes/blog')
app.use('/blogs', blogRoutes)

app.get('/', (req, res) => {
  res.send('Hello English Kafe!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

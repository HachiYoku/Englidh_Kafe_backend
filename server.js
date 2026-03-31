const express = require('express')
require('dotenv').config();

const app = express()
const port = process.env.PORT || 3000

const allowedOrigins = [
  process.env.FRONTEND_URL_LOCAL || 'http://localhost:5173',
  process.env.FRONTEND_URL_PROD,
  process.env.ADMIN_URL_LOCAL || 'http://localhost:5174',
  process.env.ADMIN_URL_PROD,
  process.env.FRONTEND_URL,
  process.env.ADMIN_URL,
].filter(Boolean)

app.use((req, res, next) => {
  const origin = req.headers.origin

  if (!origin || allowedOrigins.includes(origin)) {
    if (origin) {
      res.header('Access-Control-Allow-Origin', origin)
      res.header('Vary', 'Origin')
    }

    res.header('Access-Control-Allow-Credentials', 'true')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS')

    if (req.method === 'OPTIONS') {
      return res.sendStatus(204)
    }

    return next()
  }

  return res.status(403).json({ message: 'Origin is not allowed by CORS' })
})

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

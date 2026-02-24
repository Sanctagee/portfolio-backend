const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const pool = require('./database/')
require('dotenv').config()

const app = express()

/* ***********************
 * Middleware
 *************************/
// CORS - allows React frontend to talk to backend
app.use(cors({
  origin: function(origin, callback) {
    const allowed = [
      'http://localhost:5173',
      process.env.FRONTEND_URL
    ].filter(Boolean)
    if (!origin || allowed.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// Session
app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  name: 'portfolioSession',
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}))

/* ***********************
 * Routes
 *************************/
app.use('/api/auth', require('./routes/authRoute'))
app.use('/api/projects', require('./routes/projectRoute'))
app.use('/api/blog', require('./routes/blogRoute'))
app.use('/api/contact', require('./routes/contactRoute'))
app.use('/api/skills', require('./routes/skillRoute'))

/* ***********************
 * Health Check Route
 *************************/
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running!' })
})

/* ***********************
 * 404 Handler
 *************************/
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' })
})

/* ***********************
 * Error Handler
 *************************/
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ 
    message: 'Server error', 
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  })
})

/* ***********************
 * Start Server
 *************************/
const port = process.env.PORT || 5000
app.listen(port, () => {
  console.log(`Server running on port ${port}`)
  console.log(`Environment: ${process.env.NODE_ENV}`)
})
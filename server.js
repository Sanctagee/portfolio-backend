const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const path = require("path")
require('dotenv').config()
require('./database/') // establishes the MongoDB connection on startup

const app = express()

/* ***********************
 * Middleware
 *************************/
// CORS - allows React frontend to talk to backend
app.use(cors({
  origin: function(origin, callback) {
    const isLocalhost = !origin || /^http:\/\/localhost:\d+$/.test(origin)
    const allowed = isLocalhost || origin === process.env.FRONTEND_URL
    if (allowed) {
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

/* ***********************
 * Static Files
 *************************/
// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

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
const mongoose = require("mongoose")
require("dotenv").config()

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("Database connected successfully!"))
  .catch((err) => console.error("Database connection error:", err.message))

module.exports = mongoose
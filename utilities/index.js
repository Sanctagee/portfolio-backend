const jwt = require("jsonwebtoken")
require("dotenv").config()

const utilities = {}

/* ***************************
 * Middleware to check JWT token
 * ************************** */
utilities.checkJWT = (req, res, next) => {
  const token = req.cookies.jwt
  if (token) {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        res.clearCookie("jwt")
        return res.status(401).json({ message: "Invalid token, please login again" })
      }
      res.locals.adminData = decoded
      res.locals.loggedin = true
      next()
    })
  } else {
    return res.status(401).json({ message: "Please login to access this area" })
  }
}

/* ***************************
 * Handle Errors
 * ************************** */
utilities.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next)

module.exports = utilities
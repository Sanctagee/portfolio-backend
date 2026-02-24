const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const adminModel = require("../models/admin-model")
require("dotenv").config()

const authCont = {}

/* ***************************
 * Admin Login
 * ************************** */

authCont.login = async (req, res, next) => {
  try {
    console.log("=== LOGIN ATTEMPT ===")
    console.log("Body received:", req.body)

    const { admin_email, admin_password } = req.body

    // Validate input exists
    if (!admin_email || !admin_password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      })
    }

    // Check if admin exists
    const admin = await adminModel.getAdminByEmail(admin_email)
    console.log("Admin found:", admin ? "YES" : "NO")

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      })
    }

    // Check password
    console.log("Stored hash:", admin.admin_password)
    const passwordMatch = await bcrypt.compare(admin_password, admin.admin_password)
    console.log("Password match:", passwordMatch)

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      })
    }

    // Create JWT token
    const token = jwt.sign(
      {
        admin_id: admin.admin_id,
        admin_email: admin.admin_email,
        admin_firstname: admin.admin_firstname,
        admin_lastname: admin.admin_lastname,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "24h" }
    )

    // Set cookie
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000
    })

    // Return token in response body too
    res.json({
      success: true,
      message: "Login successful",
      token: token,
      admin: {
        admin_id: admin.admin_id,
        admin_firstname: admin.admin_firstname,
        admin_lastname: admin.admin_lastname,
        admin_email: admin.admin_email,
      }
    })
  } catch (error) {
    console.error("Login error:", error)
    next(error)
  }
}

/* ***************************
 * Admin Logout
 * ************************** */
authCont.logout = (req, res) => {
  res.clearCookie("jwt")
  res.json({ success: true, message: "Logged out successfully" })
}

/* ***************************
 * Verify Token (check if still logged in)
 * ************************** */
authCont.verify = (req, res) => {
  res.json({
    success: true,
    admin: res.locals.adminData
  })
}

module.exports = authCont
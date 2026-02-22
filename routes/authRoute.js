const express = require("express")
const router = express.Router()
const authController = require("../controllers/authController")
const { checkJWT } = require("../utilities/")

router.post("/login", authController.login)
router.post("/logout", authController.logout)
router.get("/verify", checkJWT, authController.verify)

module.exports = router
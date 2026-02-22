const express = require("express")
const router = express.Router()
const contactController = require("../controllers/contactController")
const { checkJWT } = require("../utilities/")

// Public
router.post("/", contactController.sendMessage)

// Admin only
router.get("/", checkJWT, contactController.getAllMessages)
router.put("/:id/read", checkJWT, contactController.markRead)
router.delete("/:id", checkJWT, contactController.deleteMessage)

module.exports = router
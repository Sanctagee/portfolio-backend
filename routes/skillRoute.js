const express = require("express")
const router = express.Router()
const skillController = require("../controllers/skillController")
const { checkJWT } = require("../utilities/")

// Public
router.get("/", skillController.getAllSkills)

// Admin only
router.post("/", checkJWT, skillController.addSkill)
router.put("/:id", checkJWT, skillController.updateSkill)
router.delete("/:id", checkJWT, skillController.deleteSkill)

module.exports = router

const express = require("express")
const router = express.Router()
const projectController = require("../controllers/projectController")
const { checkJWT } = require("../utilities/")

// Public Routes (anyone can access it)
router.get("/", projectController.getAllProjects)
router.get("/featured", projectController.getFeaturedProjects)
router.get("/:id", projectController.getProjectById)

// Admin only (Proected Routes)
router.post("/", checkJWT, projectController.addProject)
router.put("/:id", checkJWT, projectController.updateProject)
router.delete("/:id", checkJWT, projectController.deleteProject)

module.exports = router
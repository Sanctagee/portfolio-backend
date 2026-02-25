const express = require("express")
const router = express.Router()
const projectController = require("../controllers/projectController")
const { checkJWT } = require("../utilities/")
const upload = require("../middleware/upload") 

// Public Routes (anyone can access it)
router.get("/", projectController.getAllProjects)
router.get("/featured", projectController.getFeaturedProjects)
router.get("/:id", projectController.getProjectById)

// Admin only (Protected Routes) - WITH IMAGE UPLOAD
router.post("/", checkJWT, upload.single("project_image"), projectController.addProject)
router.put("/:id", checkJWT, upload.single("project_image"), projectController.updateProject)
router.delete("/:id", checkJWT, projectController.deleteProject)

module.exports = router
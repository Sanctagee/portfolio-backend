const express = require("express")
const router = express.Router()
const blogController = require("../controllers/blogController")
const { checkJWT } = require("../utilities/")

// Public
router.get("/published", blogController.getPublishedBlogs)
router.get("/post/:slug", blogController.getBlogBySlug)

// Admin only
router.get("/", checkJWT, blogController.getAllBlogs)
router.post("/", checkJWT, blogController.addBlog)
router.put("/:id", checkJWT, blogController.updateBlog)
router.delete("/:id", checkJWT, blogController.deleteBlog)

module.exports = router
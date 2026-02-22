const blogModel = require("../models/blog-model")

const blogCont = {}

blogCont.getAllBlogs = async (req, res, next) => {
  try {
    const blogs = await blogModel.getAllBlogs()
    res.json({ success: true, data: blogs })
  } catch (error) {
    next(error)
  }
}

blogCont.getPublishedBlogs = async (req, res, next) => {
  try {
    const blogs = await blogModel.getPublishedBlogs()
    res.json({ success: true, data: blogs })
  } catch (error) {
    next(error)
  }
}

blogCont.getBlogBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params
    const blog = await blogModel.getBlogBySlug(slug)
    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog post not found" })
    }
    res.json({ success: true, data: blog })
  } catch (error) {
    next(error)
  }
}

blogCont.addBlog = async (req, res, next) => {
  try {
    const { blog_title, blog_content, blog_summary, blog_image, blog_published } = req.body
    // Auto-generate slug from title
    const blog_slug = blog_title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
    const blog = await blogModel.addBlog(
      blog_title, blog_content, blog_summary,
      blog_image, blog_slug, blog_published
    )
    if (blog) {
      res.status(201).json({ success: true, message: "Blog post added!", data: blog })
    } else {
      res.status(500).json({ success: false, message: "Failed to add blog post" })
    }
  } catch (error) {
    next(error)
  }
}

blogCont.updateBlog = async (req, res, next) => {
  try {
    const { id } = req.params
    const { blog_title, blog_content, blog_summary, blog_image, blog_published } = req.body
    const blog_slug = blog_title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
    const blog = await blogModel.updateBlog(
      id, blog_title, blog_content, blog_summary,
      blog_image, blog_slug, blog_published
    )
    if (blog) {
      res.json({ success: true, message: "Blog post updated!", data: blog })
    } else {
      res.status(500).json({ success: false, message: "Failed to update blog post" })
    }
  } catch (error) {
    next(error)
  }
}

blogCont.deleteBlog = async (req, res, next) => {
  try {
    const { id } = req.params
    const result = await blogModel.deleteBlog(id)
    if (result) {
      res.json({ success: true, message: "Blog post deleted!" })
    } else {
      res.status(500).json({ success: false, message: "Failed to delete blog post" })
    }
  } catch (error) {
    next(error)
  }
}

module.exports = blogCont
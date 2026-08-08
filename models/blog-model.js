const mongoose = require("../database/")

const blogSchema = new mongoose.Schema({
  blog_title: { type: String, required: true },
  blog_content: { type: String, required: true },
  blog_summary: { type: String, required: true },
  blog_image: { type: String, default: null },
  blog_slug: { type: String, required: true, unique: true },
  blog_published: { type: Boolean, default: false },
  blog_date: { type: Date, default: Date.now },
  blog_updated_at: { type: Date, default: Date.now },
})

blogSchema.virtual("blog_id").get(function () {
  return this._id.toString()
})
blogSchema.set("toJSON", { virtuals: true })
blogSchema.set("toObject", { virtuals: true })

const Blog = mongoose.models.Blog || mongoose.model("Blog", blogSchema, "blog")

async function getAllBlogs() {
  try {
    return await Blog.find().sort({ blog_date: -1 })
  } catch (error) {
    console.error("getAllBlogs error:", error)
    return []
  }
}

async function getPublishedBlogs() {
  try {
    return await Blog.find({ blog_published: true }).sort({ blog_date: -1 })
  } catch (error) {
    console.error("getPublishedBlogs error:", error)
    return []
  }
}

async function getBlogBySlug(blog_slug) {
  try {
    return await Blog.findOne({ blog_slug })
  } catch (error) {
    console.error("getBlogBySlug error:", error)
    return null
  }
}

async function getBlogById(blog_id) {
  try {
    return await Blog.findById(blog_id)
  } catch (error) {
    console.error("getBlogById error:", error)
    return null
  }
}

async function addBlog(blog_title, blog_content, blog_summary, blog_image, blog_slug, blog_published) {
  try {
    // blog_date and blog_updated_at both default to now on creation —
    // so a brand-new post correctly shows no "Updated" tag until it's
    // actually edited later.
    return await Blog.create({ blog_title, blog_content, blog_summary, blog_image, blog_slug, blog_published })
  } catch (error) {
    console.error("addBlog error:", error)
    return null
  }
}

async function updateBlog(blog_id, blog_title, blog_content, blog_summary, blog_image, blog_slug, blog_published) {
  try {
    return await Blog.findByIdAndUpdate(
      blog_id,
      {
        blog_title,
        blog_content,
        blog_summary,
        blog_image,
        blog_slug,
        blog_published,
        blog_updated_at: new Date(), // stamped fresh on every update
      },
      { new: true }
    )
  } catch (error) {
    console.error("updateBlog error:", error)
    return null
  }
}

async function deleteBlog(blog_id) {
  try {
    const result = await Blog.findByIdAndDelete(blog_id)
    return !!result
  } catch (error) {
    console.error("deleteBlog error:", error)
    return false
  }
}

module.exports = { getAllBlogs, getPublishedBlogs, getBlogBySlug, getBlogById, addBlog, updateBlog, deleteBlog }
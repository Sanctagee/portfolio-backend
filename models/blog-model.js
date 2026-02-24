const pool = require("../database/")

async function getAllBlogs() {
  try {
    // blog_date is the correct column (not created_at)
    const sql = `SELECT blog_id, blog_title, blog_summary, blog_image, blog_slug, blog_published, blog_date 
                 FROM blog ORDER BY blog_date DESC`
    const result = await pool.query(sql)
    return result.rows
  } catch (error) {
    console.error("getAllBlogs error:", error)
    return []
  }
}

async function getPublishedBlogs() {
  try {
    const sql = `SELECT blog_id, blog_title, blog_summary, blog_image, blog_slug, blog_date 
                 FROM blog WHERE blog_published=true ORDER BY blog_date DESC`
    const result = await pool.query(sql)
    return result.rows
  } catch (error) {
    console.error("getPublishedBlogs error:", error)
    return []
  }
}

async function getBlogBySlug(blog_slug) {
  try {
    const sql = `SELECT * FROM blog WHERE blog_slug=$1`
    const result = await pool.query(sql, [blog_slug])
    return result.rows[0]
  } catch (error) {
    console.error("getBlogBySlug error:", error)
    return null
  }
}

async function getBlogById(blog_id) {
  try {
    const sql = `SELECT * FROM blog WHERE blog_id=$1`
    const result = await pool.query(sql, [blog_id])
    return result.rows[0]
  } catch (error) {
    console.error("getBlogById error:", error)
    return null
  }
}

async function addBlog(
    blog_title, 
    blog_content, 
    blog_summary, 
    blog_image, 
    blog_slug, 
    blog_published
) {
  try {
    const sql = `INSERT INTO blog (blog_title, blog_content, blog_summary, blog_image, blog_slug, blog_published)
                 VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`
    const result = await pool.query(sql, [
      blog_title, blog_content, blog_summary, 
      blog_image, blog_slug, blog_published
    ])
    return result.rows[0]
  } catch (error) {
    console.error("addBlog error:", error)
    return null
  }
}

async function updateBlog(blog_id, blog_title, blog_content, blog_summary, blog_image, blog_slug, blog_published) {
  try {
    const sql = `UPDATE blog SET blog_title=$1, blog_content=$2, blog_summary=$3, 
                 blog_image=$4, blog_slug=$5, blog_published=$6 WHERE blog_id=$7 RETURNING *`
    const result = await pool.query(sql, [
      blog_title, blog_content, blog_summary, 
      blog_image, blog_slug, blog_published, blog_id
    ])
    return result.rows[0]
  } catch (error) {
    console.error("updateBlog error:", error)
    return null
  }
}

async function deleteBlog(blog_id) {
  try {
    const sql = `DELETE FROM blog WHERE blog_id=$1`
    const result = await pool.query(sql, [blog_id])
    return result.rowCount > 0
  } catch (error) {
    console.error("deleteBlog error:", error)
    return false
  }
}

module.exports = { 
    getAllBlogs, 
    getPublishedBlogs, 
    getBlogBySlug, 
    getBlogById, 
    addBlog, 
    updateBlog, 
    deleteBlog 
}
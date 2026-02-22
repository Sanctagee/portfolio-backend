const pool = require('../database/')

/* ***************************
 * Get all projects
 * ************************** */
async function getAllProjects() {
  try {
    const sql = `SELECT * FROM project ORDER BY project_date DESC`
    const result = await pool.query(sql)
    return result.rows
  } catch (error) {
    console.error('getAllProjects error:', error)
    return []
  }
}

/* ***************************
 * Get featured projects
 * ************************** */
async function getFeaturedProjects() {
  try {
    const sql = `SELECT * FROM project WHERE project_featured = true 
                 ORDER BY project_date DESC LIMIT 6`
    const result = await pool.query(sql)
    return result.rows
  } catch (error) {
    console.error('getFeaturedProjects error:', error)
    return []
  }
}

/* ***************************
 * Get project by ID
 * ************************** */
async function getProjectById(project_id) {
  try {
    const sql = `SELECT * FROM project WHERE project_id = $1`
    const result = await pool.query(sql, [project_id])
    return result.rows[0]
  } catch (error) {
    console.error('getProjectById error:', error)
    return null
  }
}

/* ***************************
 * Add new project
 * ************************** */
async function addProject(
  project_title,
  project_description,
  project_image,
  project_url,
  project_github,
  project_tech,
  project_featured
) {
  try {
    const sql = `INSERT INTO project 
      (project_title, project_description, project_image, 
       project_url, project_github, project_tech, project_featured)
      VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`
    const result = await pool.query(sql, [
      project_title, project_description, project_image,
      project_url, project_github, project_tech, project_featured
    ])
    return result.rows[0]
  } catch (error) {
    console.error('addProject error:', error)
    return null
  }
}

/* ***************************
 * Update project
 * ************************** */
async function updateProject(
  project_id,
  project_title,
  project_description,
  project_image,
  project_url,
  project_github,
  project_tech,
  project_featured
) {
  try {
    const sql = `UPDATE project SET 
      project_title = $1, project_description = $2,
      project_image = $3, project_url = $4,
      project_github = $5, project_tech = $6,
      project_featured = $7
      WHERE project_id = $8 RETURNING *`
    const result = await pool.query(sql, [
      project_title, project_description, project_image,
      project_url, project_github, project_tech,
      project_featured, project_id
    ])
    return result.rows[0]
  } catch (error) {
    console.error('updateProject error:', error)
    return null
  }
}

/* ***************************
 * Delete project
 * ************************** */
async function deleteProject(project_id) {
  try {
    const sql = `DELETE FROM project WHERE project_id = $1`
    const result = await pool.query(sql, [project_id])
    return result.rowCount > 0
  } catch (error) {
    console.error('deleteProject error:', error)
    return false
  }
}

module.exports = {
  getAllProjects,
  getFeaturedProjects,
  getProjectById,
  addProject,
  updateProject,
  deleteProject
}
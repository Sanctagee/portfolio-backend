const pool = require("../database/")

async function getAdminByEmail(admin_email) {
  try {
    const sql = `SELECT * FROM admin WHERE admin_email=$1`
    const result = await pool.query(sql, [admin_email])
    return result.rows[0]
  } catch (error) {
    console.error("getAdminByEmail error:", error)
    return null
  }
}

async function getAdminById(admin_id) {
  try {
    const sql = `SELECT admin_id, admin_firstname, admin_lastname, admin_email FROM admin WHERE admin_id=$1`
    const result = await pool.query(sql, [admin_id])
    return result.rows[0]
  } catch (error) {
    console.error("getAdminById error:", error)
    return null
  }
}

module.exports = { getAdminByEmail, getAdminById }
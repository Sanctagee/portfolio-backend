const pool = require("../database/")

async function getAllSkills() {
  try {
    const sql = `SELECT * FROM skill ORDER BY skill_order ASC`
    const result = await pool.query(sql)
    return result.rows
  } catch (error) {
    console.error("getAllSkills error:", error)
    return []
  }
}

async function addSkill(
    skill_name, 
    skill_category, 
    skill_level, 
    skill_icon, 
    skill_order
) {
  try {
    const sql = `INSERT INTO skill (skill_name, skill_category, skill_level, skill_icon, skill_order)
                 VALUES ($1, $2, $3, $4, $5) RETURNING *`
    const result = await pool.query(sql, [
        skill_name, 
        skill_category, 
        skill_level, 
        skill_icon, 
        skill_order
    ])
    return result.rows[0]
  } catch (error) {
    console.error("addSkill error:", error)
    return null
  }
}

async function updateSkill(
    skill_id, 
    skill_name, 
    skill_category, 
    skill_level, 
    skill_icon, 
    skill_order
) {
  try {
    const sql = `UPDATE skill SET skill_name=$1, skill_category=$2, skill_level=$3, 
                 skill_icon=$4, skill_order=$5 WHERE skill_id=$6 RETURNING *`
    const result = await pool.query(sql, [
        skill_name, 
        skill_category, 
        skill_level, 
        skill_icon, 
        skill_order, 
        skill_id
    ])
    return result.rows[0]
  } catch (error) {
    console.error("updateSkill error:", error)
    return null
  }
}

async function deleteSkill(skill_id) {
  try {
    const sql = `DELETE FROM skill WHERE skill_id=$1`
    const result = await pool.query(sql, [skill_id])
    return result.rowCount > 0
  } catch (error) {
    console.error("deleteSkill error:", error)
    return false
  }
}

module.exports = { 
    getAllSkills, 
    addSkill, 
    updateSkill, 
    deleteSkill 
}
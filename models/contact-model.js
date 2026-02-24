const pool = require("../database/")

async function addContact(
    contact_name, 
    contact_email, 
    contact_subject, 
    contact_message
) {
  try {
    const sql = `INSERT INTO contact (contact_name, contact_email, contact_subject, contact_message)
                 VALUES ($1, $2, $3, $4) RETURNING *`
    const result = await pool.query(sql, [
        contact_name, 
        contact_email, 
        contact_subject, 
        contact_message
    ])
    return result.rows[0]
  } catch (error) {
    console.error("addContact error:", error)
    return null
  }
}

async function getAllContacts() {
  try {
    // Using correct column names from database: contact_read, contact_date
    const sql = `SELECT 
                   contact_id,
                   contact_name,
                   contact_email,
                   contact_subject,
                   contact_message,
                   contact_read,
                   contact_date
                 FROM contact 
                 ORDER BY contact_date DESC`
    const result = await pool.query(sql)
    return result.rows
  } catch (error) {
    console.error("getAllContacts error:", error)
    return []
  }
}

async function markContactRead(contact_id) {
  try {
    // Correct column name is contact_read (not is_read)
    const sql = `UPDATE contact SET contact_read=true WHERE contact_id=$1 RETURNING *`
    const result = await pool.query(sql, [contact_id])
    return result.rows[0]
  } catch (error) {
    console.error("markContactRead error:", error)
    return null
  }
}

async function deleteContact(contact_id) {
  try {
    const sql = `DELETE FROM contact WHERE contact_id=$1`
    const result = await pool.query(sql, [contact_id])
    return result.rowCount > 0
  } catch (error) {
    console.error("deleteContact error:", error)
    return false
  }
}

module.exports = { 
    addContact, 
    getAllContacts, 
    markContactRead, 
    deleteContact 
}
const mongoose = require("../database/")

const adminSchema = new mongoose.Schema({
  admin_firstname: { type: String, required: true },
  admin_lastname: { type: String, required: true },
  admin_email: { type: String, required: true, unique: true },
  admin_password: { type: String, required: true },
})

adminSchema.virtual("admin_id").get(function () {
  return this._id.toString()
})
adminSchema.set("toJSON", { virtuals: true })
adminSchema.set("toObject", { virtuals: true })

const Admin = mongoose.models.Admin || mongoose.model("Admin", adminSchema, "admin")

async function getAdminByEmail(admin_email) {
  try {
    const admin = await Admin.findOne({ admin_email })
    return admin
  } catch (error) {
    console.error("getAdminByEmail error:", error)
    return null
  }
}

async function getAdminById(admin_id) {
  try {
    const admin = await Admin.findById(admin_id).select("admin_firstname admin_lastname admin_email")
    return admin
  } catch (error) {
    console.error("getAdminById error:", error)
    return null
  }
}

module.exports = { getAdminByEmail, getAdminById, Admin }

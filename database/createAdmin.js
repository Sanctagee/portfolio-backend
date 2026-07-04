// One-time script to create your admin login in MongoDB.
// Run from backend/backend with: node database/createAdmin.js
// Edit the values below first, then run it once — you can delete this file after.
require("dotenv").config()
const bcrypt = require("bcryptjs")
const mongoose = require("./index")
const { Admin } = require("../models/admin-model")

const ADMIN = {
  admin_firstname: "Gabriel",
  admin_lastname: "Nwofoke",
  admin_email: "gabbytech101@gmail.com",  
  admin_password: "OsinaGabby@01"
}

async function run() {
  try {
    const existing = await Admin.findOne({ admin_email: ADMIN.admin_email })
    if (existing) {
      console.log("An admin with that email already exists — nothing created.")
      return
    }
    const hashed = await bcrypt.hash(ADMIN.admin_password, 10)
    await Admin.create({ ...ADMIN, admin_password: hashed })
    console.log(`Admin account created for ${ADMIN.admin_email}. You can now log in and should delete this file.`)
  } catch (err) {
    console.error("Failed to create admin:", err)
  } finally {
    await mongoose.connection.close()
  }
}

run()

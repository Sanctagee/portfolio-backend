const mongoose = require("../database/")

const contactSchema = new mongoose.Schema({
  contact_name: { type: String, required: true },
  contact_email: { type: String, required: true },
  contact_subject: { type: String, required: true },
  contact_message: { type: String, required: true },
  contact_read: { type: Boolean, default: false },
  contact_date: { type: Date, default: Date.now },
  contact_replied: { type: Boolean, default: false },
  contact_reply_message: { type: String, default: null },
  contact_replied_at: { type: Date, default: null },
})

contactSchema.virtual("contact_id").get(function () {
  return this._id.toString()
})
contactSchema.set("toJSON", { virtuals: true })
contactSchema.set("toObject", { virtuals: true })

const Contact = mongoose.models.Contact || mongoose.model("Contact", contactSchema, "contact")

async function addContact(contact_name, contact_email, contact_subject, contact_message) {
  try {
    return await Contact.create({ contact_name, contact_email, contact_subject, contact_message })
  } catch (error) {
    console.error("addContact error:", error)
    return null
  }
}

async function getAllContacts() {
  try {
    return await Contact.find().sort({ contact_date: -1 })
  } catch (error) {
    console.error("getAllContacts error:", error)
    return []
  }
}

async function getContactById(contact_id) {
  try {
    return await Contact.findById(contact_id)
  } catch (error) {
    console.error("getContactById error:", error)
    return null
  }
}

async function markContactRead(contact_id) {
  try {
    return await Contact.findByIdAndUpdate(contact_id, { contact_read: true }, { new: true })
  } catch (error) {
    console.error("markContactRead error:", error)
    return null
  }
}

async function markContactReplied(contact_id, reply_message) {
  try {
    return await Contact.findByIdAndUpdate(
      contact_id,
      {
        contact_replied: true,
        contact_reply_message: reply_message,
        contact_replied_at: new Date(),
      },
      { new: true }
    )
  } catch (error) {
    console.error("markContactReplied error:", error)
    return null
  }
}

async function deleteContact(contact_id) {
  try {
    const result = await Contact.findByIdAndDelete(contact_id)
    return !!result
  } catch (error) {
    console.error("deleteContact error:", error)
    return false
  }
}

module.exports = {
  addContact,
  getAllContacts,
  getContactById,
  markContactRead,
  markContactReplied,
  deleteContact,
}
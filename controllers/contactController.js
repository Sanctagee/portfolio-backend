const contactModel = require("../models/contact-model")

const contactCont = {}

contactCont.sendMessage = async (req, res, next) => {
  try {
    const { contact_name, contact_email, contact_subject, contact_message } = req.body
    const contact = await contactModel.addContact(
      contact_name, contact_email, contact_subject, contact_message
    )
    if (contact) {
      res.status(201).json({ success: true, message: "Message sent successfully!" })
    } else {
      res.status(500).json({ success: false, message: "Failed to send message" })
    }
  } catch (error) {
    next(error)
  }
}

contactCont.getAllMessages = async (req, res, next) => {
  try {
    const messages = await contactModel.getAllContacts()
    res.json({ success: true, data: messages })
  } catch (error) {
    next(error)
  }
}

contactCont.markRead = async (req, res, next) => {
  try {
    const { id } = req.params
    const result = await contactModel.markContactRead(id)
    if (result) {
      res.json({ success: true, message: "Message marked as read" })
    } else {
      res.status(500).json({ success: false, message: "Failed to update message" })
    }
  } catch (error) {
    next(error)
  }
}

contactCont.deleteMessage = async (req, res, next) => {
  try {
    const { id } = req.params
    const result = await contactModel.deleteContact(id)
    if (result) {
      res.json({ success: true, message: "Message deleted!" })
    } else {
      res.status(500).json({ success: false, message: "Failed to delete message" })
    }
  } catch (error) {
    next(error)
  }
}

module.exports = contactCont
const contactModel = require("../models/contact-model")
const { sendReplyEmail } = require("../utilities/mailer")

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

// Sends a real email reply through Gmail (via Nodemailer) and records
// the reply on the contact document for reference in the admin panel
contactCont.replyToMessage = async (req, res, next) => {
  try {
    const { id } = req.params
    const { reply_message } = req.body

    if (!reply_message || !reply_message.trim()) {
      return res.status(400).json({ success: false, message: "Reply message cannot be empty" })
    }

    const contact = await contactModel.getContactById(id)
    if (!contact) {
      return res.status(404).json({ success: false, message: "Message not found" })
    }

    await sendReplyEmail(
      contact.contact_email,
      contact.contact_name,
      contact.contact_subject,
      reply_message
    )

    const updated = await contactModel.markContactReplied(id, reply_message)

    res.json({ success: true, message: "Reply sent!", data: updated })
  } catch (error) {
    console.error("replyToMessage error:", error)
    res.status(500).json({ success: false, message: "Failed to send reply. Please try again." })
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
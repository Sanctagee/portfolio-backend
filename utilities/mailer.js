const nodemailer = require("nodemailer")

// Reuses one transporter across requests instead of creating a new
// connection every time an email is sent
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, 
  },
})

/**
 * Sends a reply email to someone who messaged through the contact form.
 * @param {string} toEmail - recipient's email address
 * @param {string} toName - recipient's name, used in the greeting
 * @param {string} originalSubject - the subject of their original message
 * @param {string} replyMessage - the reply text written in the admin panel
 */
async function sendReplyEmail(toEmail, toName, originalSubject, replyMessage) {
  const mailOptions = {
    from: `"Gabriel Nwofoke" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: `Re: ${originalSubject}`,
    text: `Hi ${toName},\n\n${replyMessage}\n\n— Gabriel`,
    html: `
      <div style="font-family: Arial, sans-serif; font-size: 15px; color: #1a2035; line-height: 1.7;">
        <p>Hi ${toName},</p>
        <p>${replyMessage.replace(/\n/g, "<br/>")}</p>
        <p style="margin-top: 24px;">— Gabriel</p>
      </div>
    `,
  }

  return transporter.sendMail(mailOptions)
}

module.exports = { sendReplyEmail }
const { Resend } = require("resend")

const resend = new Resend(process.env.RESEND_API_KEY)

/**
 * Sends a reply email to someone who messaged through the contact form.
 * Uses Resend (HTTPS-based) instead of raw SMTP, since Render blocks
 * outbound SMTP ports on its free tier — this avoids that entirely.
 *
 * @param {string} toEmail - recipient's email address
 * @param {string} toName - recipient's name, used in the greeting
 * @param {string} originalSubject - the subject of their original message
 * @param {string} replyMessage - the reply text written in the admin panel
 */
async function sendReplyEmail(toEmail, toName, originalSubject, replyMessage) {
  const { data, error } = await resend.emails.send({
    // Resend's shared test sender — works immediately, no domain setup
    // needed. Swap this for something like "Gabriel Nwofoke <hello@yourdomain.com>"
    // once you've verified your own custom domain with Resend.
    from: "Gabriel Nwofoke <onboarding@resend.dev>",
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
  })

  if (error) {
    console.error("Resend error:", error)
    throw new Error(error.message || "Failed to send email via Resend")
  }

  return data
}

module.exports = { sendReplyEmail }
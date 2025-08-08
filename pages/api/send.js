import nodemailer from 'nodemailer'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const { recipients, subject, emailContent } = req.body

  if (!recipients || recipients.length === 0) return res.status(400).json({ error: 'Recipients required' })
  if (!emailContent) return res.status(400).json({ error: 'Email content required' })

  try {
    const host = process.env.SMTP_HOST
    const port = parseInt(process.env.SMTP_PORT || '587')
    const user = process.env.SMTP_USER
    const pass = process.env.SMTP_PASS

    if (!host || !user || !pass) return res.status(500).json({ error: 'SMTP not configured' })

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465, // true for 465, false for others
      auth: { user, pass },
    })

    const info = await transporter.sendMail({
      from: `"AI Email" <${user}>`,
      to: Array.isArray(recipients) ? recipients.join(',') : recipients,
      subject: subject || process.env.DEFAULT_SUBJECT || 'Generated Email',
      text: emailContent,
      html: emailContent.replace(/\n/g, '<br/>')
    })

    console.log('Message sent: ', info.messageId)
    return res.status(200).json({ message: 'Email sent', info: info.messageId })
  } catch (err) {
    console.error('Send error', err)
    return res.status(500).json({ error: 'Failed to send email' })
  }
}
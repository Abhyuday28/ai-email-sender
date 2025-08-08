import { useState } from 'react'
import axios from 'axios'

export default function Home() {
  const [recipients, setRecipients] = useState('')
  const [prompt, setPrompt] = useState('')
  const [emailContent, setEmailContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('')

  const handleGenerate = async () => {
    if (!prompt.trim()) return alert('Enter a prompt')
    setLoading(true)
    setStatus('Generating email...')
    try {
      const res = await axios.post('/api/generate', { prompt })
      setEmailContent(res.data.email || '')
      setStatus('Generated. You can edit the email below.')
    } catch (err) {
      console.error(err)
      setStatus('Failed to generate email')
      alert('AI generation failed. Check server logs or your API key.')
    } finally {
      setLoading(false)
    }
  }

  const handleSend = async () => {
    const to = recipients.split(',').map(s => s.trim()).filter(Boolean)
    if (to.length === 0) return alert('Add at least one recipient')
    if (!emailContent.trim()) return alert('Email content empty')

    setLoading(true)
    setStatus('Sending...')
    try {
      const res = await axios.post('/api/send', {
        recipients: to,
        subject: process.env.NEXT_PUBLIC_DEFAULT_SUBJECT || 'Generated Email',
        emailContent,
      })
      setStatus(res.data.message || 'Sent')
    } catch (err) {
      console.error(err)
      setStatus('Failed to send email')
      alert('Failed to send. Check SMTP settings and server logs.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">AI Email Sender</h1>

        <label className="block mb-2">Recipients (comma separated)</label>
        <input
          value={recipients}
          onChange={(e) => setRecipients(e.target.value)}
          placeholder="alice@example.com, bob@example.com"
          className="w-full p-2 border rounded mb-4"
        />

        <label className="block mb-2">Prompt for AI</label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Write a polite follow-up email about the project status..."
          className="w-full p-2 border rounded mb-4 h-24"
        />

        <div className="flex gap-2 mb-4">
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            {loading ? 'Working...' : 'Generate Email'}
          </button>

          <button
            onClick={() => { setPrompt('') ; setEmailContent('') }}
            className="px-4 py-2 bg-gray-200 rounded"
          >
            Reset
          </button>
        </div>

        {emailContent ? (
          <>
            <label className="block mb-2">Generated Email (editable)</label>
            <textarea
              value={emailContent}
              onChange={(e) => setEmailContent(e.target.value)}
              className="w-full p-2 border rounded mb-4 h-48"
            />

            <div className="flex gap-2">
              <button
                onClick={handleSend}
                disabled={loading}
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                Send Email
              </button>

              <button
                onClick={() => navigator.clipboard?.writeText(emailContent)}
                className="px-4 py-2 bg-yellow-200 rounded"
              >
                Copy
              </button>
            </div>
          </>
        ) : null}

        <p className="mt-4 text-sm text-gray-600">{status}</p>
      </div>
    </div>
  )
}
import axios from 'axios'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { prompt } = req.body
  if (!prompt) return res.status(400).json({ error: 'Missing prompt' })

  try {
    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey) return res.status(500).json({ error: 'Missing GROQ_API_KEY' })

    const body = {
      model: 'llama3-8b-8192',
      messages: [
        { role: 'system', content: 'You are an assistant that writes clear, professional emails.' },
        { role: 'user', content: `Write a well-structured email based on the prompt: ${prompt}` }
      ],
      max_tokens: 600
    }

    const r = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      body,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    )

    const email =
      r.data?.choices?.[0]?.message?.content ||
      r.data?.choices?.[0]?.text ||
      ''

    return res.status(200).json({ email })
  } catch (err) {
    console.error('AI error', err.response?.data || err.message || err)
    return res.status(500).json({ error: 'AI generation failed' })
  }
}

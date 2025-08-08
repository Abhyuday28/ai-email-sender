AI Email Sender

An AI-powered full-stack application that allows you to generate professional emails from a prompt, edit them, and send them to specified recipients via SMTP.

Features

Enter recipient email addresses

Input a prompt for the AI to generate an email

Edit the generated email before sending

Send via SMTP (Gmail-compatible)

Tech Stack

Frontend: Next.js, Tailwind CSS

Backend: Next.js API routes

AI: Groq API (LLaMA 3)

Email: Nodemailer with SMTP

Getting Started

1. Clone the repository

git clone <your-repo-url>
cd ai-email-sender

2. Install dependencies

npm install

3. Environment variables

Create a .env.local file:

GROQ_API_KEY=your_groq_api_key
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
DEFAULT_SUBJECT=Generated Email

Note: For Gmail, enable 2FA and create an App Password.

4. Run locally

npm run dev

Visit http://localhost:3000.

5. Deployment (Vercel)

Push your code to GitHub

Import the repo on Vercel

Add the same environment variables in Project Settings → Environment Variables

Deploy!
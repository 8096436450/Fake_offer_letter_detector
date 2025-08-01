# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
.
 ## Based on the current implementation, the AI analyzes the offer letter by looking for the following key indicators to determine if it's real or potentially fake:
 1.Contact Information & Domain: It checks for generic email domains (like @gmail.com or @yahoo.com) instead of a professional corporate email address.
 2.Grammar & Professionalism: It scans the text for spelling mistakes, poor grammar, and unprofessional language.
 3.Vague Details: It verifies if the job title, salary, responsibilities, and start date are clear and specific. Vague offers are often a red flag.
 4.Urgency & Pressure: It looks for any language that pressures the recipient to act immediately, which is a common scam tactic.
 5.Requests for Money or Personal Info: It flags any requests for payment (for equipment, training, background checks) or for sensitive personal information that isn't typically required at the offer stage.
 6.Formatting & Branding: It assesses whether the document's layout, company logo, and overall branding appear professional and authentic.
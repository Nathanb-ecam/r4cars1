import { env } from "@/config/env";

// lib/email.js
export async function sendConfirmationEmail({ toEmail, toName }) {

const apiKey = env.brevo.apiKey;
  if (!apiKey) {
    throw new Error('BREVO_API_KEY is not defined in environment variables.');
  }
  console.log("LIB"+ toEmail + toName)

  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': apiKey,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      sender: {
        name: 'Labeuromed',
        email: 'alain.steyaert@gmail.com', 
      },
      to: [
        {
          email: toEmail,
          name: toName,
        },
      ],
      subject: 'Order confirmation',
      templateId:6
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error('Erreur Brevo :', errorData);
    throw new Error('Erreur lors de l’envoi de l’email');
  }

  return await response.json();
}

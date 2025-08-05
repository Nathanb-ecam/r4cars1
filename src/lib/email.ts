import { env } from "@/config/env";



// lib/email.js
export async function sendContactMail({ fromEmail, fromName, fromPhone, message }: {
  fromEmail: string;
  fromName: string;
  fromPhone?: string;
  message: string;
}) {
  const apiKey = env.brevo.apiKey;
  if (!apiKey) {
    throw new Error('BREVO_API_KEY is not defined in environment variables.');
  }

  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': apiKey,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      sender: {
        name: fromName,
        email: fromEmail,
      },
      to: [
        {
        name: 'r4cars',
        email: 'info@r4cars.ch',
        },
      ],
      subject: 'Nouveau message de contact',
      templateId: 1,
      params: {
        fromName,
        fromEmail,
        fromPhone,
        message,
      },
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error('Erreur Brevo :', errorData);
    throw new Error('Erreur lors de l’envoi de l’email');
  }

  return await response.json();
}



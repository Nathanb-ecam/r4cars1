import { env } from "@/config/env";

interface EmailParams {
  fromName: string;
  fromEmail: string;
  fromPhone?: string;
  message: string;
  url?: string;
}

// lib/email.js
export async function sendContactMail({ fromEmail, fromName, fromPhone, message, url }: {
  fromEmail: string;
  fromName: string;
  fromPhone?: string;
  url? : string;
  message: string;
}) {
  const apiKey = env.brevo.apiKey;
  if (!apiKey) {
    throw new Error('BREVO_API_KEY is not defined in environment variables.');
  }

  const brand_name = env.company.brand_name
  const infoMailAddress = env.company.mail

  const params: EmailParams = {
    fromName,
    fromEmail,
    fromPhone,
    message,
  };

  if (url && url.length > 0 && url.includes('/product')) {
    params.url = `${env.app.domain}${url}`;
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
        name: brand_name,
        email: infoMailAddress,
      },
      to: [
        {
        name: brand_name,
        email: infoMailAddress,
        },
      ],
      subject: 'Nouveau message de contact',
      templateId: 1,
      params: params,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error('Erreur Brevo :', errorData);
    throw new Error('Erreur lors de l’envoi de l’email');
  }

  return await response.json();
}



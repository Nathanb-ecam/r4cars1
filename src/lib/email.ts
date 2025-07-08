import { env } from "@/config/env";

export interface BrevoOrderConfirmationTemplate{
  name:string;
  total:string;
  shippingCosts:string;
  products:{name:string,originalPrice:number, discountedPrice:number, imageUrl:string}[]
}


// lib/email.js
export async function sendConfirmationEmail({ toEmail, toName, orderTemplate }: {
  toEmail: string;
  toName: string;
  orderTemplate: BrevoOrderConfirmationTemplate;
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
      templateId:6,
      params: {
        toName,
        total: orderTemplate.total,
        shippingCosts: orderTemplate.shippingCosts, // Note: match your interface key
        products: orderTemplate.products,
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

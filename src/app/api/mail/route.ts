import { sendContactMail} from '@/lib/email';
import { NextResponse } from 'next/server';

export async function POST(request:Request) {
  
    try{
  const { fromEmail, fromName, fromPhone, message } = await request.json();

    if (!fromEmail || !fromName || !message) { 
      return NextResponse.json("Missing fromEmail, fromName or message")
    }


  // 2. Envoyer l'email avec brevo {
    await sendContactMail({
      fromEmail: fromEmail,
      fromName: fromName,
      fromPhone: fromPhone,
      message: message
    });

    return NextResponse.json({ status: 201 });
  } catch (error) {
    console.log(error)
    return NextResponse.json('Erreur lors de l’envoi de l’email.', { status: 500 });      
  }

}

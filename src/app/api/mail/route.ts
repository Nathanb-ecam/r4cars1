import {sendConfirmationEmail} from '@/lib/email';
import { NextResponse } from 'next/server';

export async function POST(request:Request) {
  
    try{
  const { toEmail, toName, orderTemplate } = await request.json();

    if (!toEmail || !toName) { 
      return NextResponse.json("Missing toEmail or toName")
    }


  // 2. Envoyer l'email avec brevo {
    await sendConfirmationEmail({
      toEmail,
      toName,      
      orderTemplate  
    });

    return NextResponse.json({ status: 201 });
  } catch (error) {
    return NextResponse.json('Erreur lors de l’envoi de l’email.', { status: 500 });      
  }

}

"use client";
import { useProductStore } from '@/store/productStore';
import { useEffect, useState } from 'react';
import HomeProductSection from '@/components/visitor/HomeProductSection';
import { useTranslations } from 'next-intl';
import { MdEmail, MdLocationOn, MdPhone } from 'react-icons/md';
import { LabelInput } from '@/components/ui/LabelInput';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { IconLabel } from '@/components/ui/IconLabel';
import { sendContactMail } from '@/lib/email';

export const dynamic = 'force-dynamic';



export default function ContactPage() {    
  
  const c = useTranslations('CompanyInfo');  
  const [contactData, setContactData] = useState({
    fromName: '',
    fromEmail: '',
    fromPhone: '',
    message: ''
  });


  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Handle contact form submission logic here
    console.log('Contact Data:', contactData);    
    
    // Call the API to send the contact email on endpoint /api/mail
    try {
      const response = await fetch('/api/mail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to send email');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error sending contact email:', error);
      throw error;
    }
    // Reset form
    setContactData({
      fromName: '',
      fromEmail: '',
      fromPhone: '',
      message: ''
    });
  };
  
  return(
    <div className='min-h-[80vh] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-slate-700'>Contactez-nous</h1>        
      </div>

      <div className='flex md:flex-row flex-col gap-10'>
        <div className='md:basis-[70%] md:max-w-[70%] w-full'>
          <div className='font-light text-lg text-gray-800'>
              Contactez-nous pour tout ce qui concerne notre entreprise ou nos services.<br/>
              Nous ferons de notre mieux pour vous répondre dans les plus brefs délais.
          </div>
          
            <form className='flex flex-col gap-4 mt-12' onSubmit={handleContactSubmit}>
              <div className='flex gap-4'>
                <LabelInput  value={contactData.fromName} required={true} className="flex-1" label='Prénom et nom' onChange={(value) => setContactData({...contactData, fromName: value})} placeholder="John Doe"/>
                <LabelInput  value={contactData.fromPhone} className="flex-1" label='Phone' onChange={(value) => setContactData({...contactData, fromPhone: value})} placeholder="+33 1 23 45 67 89"/>
              </div>
              <LabelInput value={contactData.fromEmail} required={true} label='Email' onChange={(value) => setContactData({...contactData, fromEmail: value})} placeholder="johndoe@example.com"/>
              <LabelInput inputSize='lg' value={contactData.message} required={true} label='Question' onChange={(value) => setContactData({...contactData, message: value})} placeholder="Votre message"/>
              <div className='text-right'>
                <PrimaryButton className="px-10 rounded-lg" text="Envoyer" type="submit" onClick={() => {}} />
              </div>
            </form>
          
        </div>
        <div className='md:basis-[30%] md:max-w-[30%] w-full flex flex-col gap-4'>
          <h2 className='font-bold text-slate-700'>La société</h2>
          <IconLabel icon={<MdPhone className="text-xl" />} text={c('phone')} />
          <IconLabel icon={<MdLocationOn className="text-xl" />} text={c('address')} />
          <IconLabel icon={<MdEmail className="text-xl" />} text={c('email')} />
        </div>
      </div>

    </div>
  )
} 
"use client";

import {useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { MdEmail, MdLocationOn, MdPhone } from 'react-icons/md';
import { LabelInput } from '@/components/ui/LabelInput';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { IconLabel } from '@/components/ui/IconLabel';
import { useSearchParams } from 'next/navigation';
import { env } from '@/config/env';

export const dynamic = 'force-dynamic';



export default function ContactPage() {    
       
  const searchParams = useSearchParams();
  const [linkedUrl, setLinkedUrl] = useState(searchParams.get('url'));
  const carFullName = searchParams.get('carFullName');
  // console.log("RECEIVED" + url)
  const [carLinked, setCarLinked] = useState((linkedUrl?.length && linkedUrl?.length > 0) ? true : false);
  
  const [successfullySent, setSuccessfullySent] = useState<boolean | null>(null);  
  const [contactData, setContactData] = useState({
    fromName: '',
    fromEmail: '',
    fromPhone: '',
    url: linkedUrl,
    message: ''
  });

    useEffect(() => {
    if (successfullySent !== null) {
      const timer = setTimeout(() => setSuccessfullySent(null), 3000);
      return () => clearTimeout(timer); // Cleanup on unmount or reset
    }
  }, [successfullySent]);

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

      await response.json();
      setSuccessfullySent(true);
    } catch (error) {
      setSuccessfullySent(false);
      console.error('Error sending contact email:', error);
      setContactData({
        fromName: '',
        fromEmail: '',
        fromPhone: '',
        url: '',
        message: ''
      });
      throw error;
    }
    finally {
      // Optionally, you can reset the form or show a success message
      // Reset form

    }
  };
  
  return(
    <>

      {successfullySent !== null && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
          <div className={`relative px-6 py-4 rounded-lg shadow-lg max-w-md w-full transition-all duration-300 flex items-center justify-between gap-4
            ${successfullySent ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            
            <p className="text-center">
              {successfullySent
                ? 'Merci pour votre message ! Nous vous répondrons dans les plus brefs délais.'
                : `Votre message n\'a pas pu être envoyé. Merci de réessayer plus tard ou de nous contacter à "${env.company.mail}".`}
            </p>

            <button
              className="text-lg font-bold focus:outline-none"
              onClick={() => setSuccessfullySent(null)}
            >
              &times;
            </button>
          </div>
        </div>
      )}



      <div className='min-h-[80vh] max-w-7xl mx-auto px-4 md:pb-10 sm:px-6 lg:px-8'>
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
                <div className='flex gap-4 flex-wrap'>
                  <LabelInput  value={contactData.fromName} required={true} className="flex-1" label='Prénom et nom' onChange={(value) => setContactData({...contactData, fromName: value})} placeholder="John Doe"/>
                  <LabelInput  value={contactData.fromPhone} className="flex-1" label='Phone' onChange={(value) => setContactData({...contactData, fromPhone: value})} placeholder="+41 12 345 67 89"/>
                </div>
                <LabelInput value={contactData.fromEmail} type='email' required={true} label='Email' onChange={(value) => setContactData({...contactData, fromEmail: value})} placeholder="johndoe@example.com"/>
                <LabelInput inputSize='lg' value={contactData.message} required={true} label='Question' onChange={(value) => setContactData({...contactData, message: value})} placeholder="Votre message"/>
                
                {carLinked && 
                  
                    <div className='flex items-center gap-2'>

                      <h2 className='text-gray-600 text-sm tracking-tight'>Annonce liée: </h2>
                      <div className='text-xs bg-gray-100 rounded-full w-full py-[.2rem] px-4 flex items-center w-max'>
                        <label className='text-gray-700 tracking-tight'>{carFullName}</label>
                        <button
                          type="button"
                          onClick={() => {setCarLinked(false); setContactData({...contactData, url : ""});}}
                          className="ml-2 text-gray-400 text-lg hover:text-red-500 hover:cursor-pointer"
                        >
                          &times;
                        </button>
                      </div>                    
                    </div>
                  }
                
                <div className='text-right'>
                  <PrimaryButton className="px-10 rounded-lg" text="Envoyer" type="submit" onClick={() => {}} />
                </div>
              </form>
            
          </div>
          <div className='md:basis-[30%] md:max-w-[30%] w-full flex flex-col gap-4 pb-10'>
            <h2 className='font-bold text-slate-700'>La société</h2>
            <IconLabel icon={<MdPhone className="text-xl" />} text={env.company.phone} />
            <IconLabel icon={<MdLocationOn className="text-xl" />} text={env.company.address} />
            <IconLabel icon={<MdEmail className="text-xl" />} text={env.company.mail} />
          </div>
        </div>

      </div>
    </>
  )
} 
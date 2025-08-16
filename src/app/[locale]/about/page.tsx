"use client";
import { useProductStore } from '@/store/productStore';
import { useEffect } from 'react';
import HomeProductSection from '@/components/visitor/HomeProductSection';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { LayoutEquipe } from '@/components/about/LayoutEquipe';
import { env } from '@/config/env';

export const dynamic = 'force-dynamic';



export default function AboutPage() {    
  
  const t = useTranslations('Home');  

  return (
    <div className='min-h-[80vh]'>
      <div className='max-w-7xl mx-auto'>
        
        <div className='px-4 sm:px-6 lg:px-8'>
          <div>
            <h2 className='md:leading-loose text-xl md:text-2xl text-slate-700 font-bold tracking-tight'>Rencontrez notre équipe de vente</h2>
            <p className='tracking-wider'>Des professionels dévoués au service de notre réussite</p>
          </div>
        </div>

        <LayoutEquipe className='my-10 md:my-20 px-4 sm:px-6 lg:px-8'/>
        <LayoutEquipe className='my-10 md:my-20 px-4 sm:px-6 lg:px-8'/>
      
      </div>

      <div className='bg-slate-100 p-6'>
        <div className='max-w-7xl mx-auto'>
          <div className='px-4 sm:px-6 lg:px-8 my-6'>
            <h2 className='md:leading-loose text-xl md:text-2xl tracking-tight font-bold text-slate-700'>Notre garage</h2>
            <p></p>
            <div className="flex justify-center my-10">
              <iframe                 
                src={`${env.company.maps}`}
                width="600" height="450" 
                // style="border:0;" 
                allowFullScreen={true} loading="lazy" referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
"use client";
import { useProductStore } from '@/store/productStore';
import { useEffect } from 'react';
import HomeProductSection from '@/components/visitor/HomeProductSection';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { LayoutEquipe } from '@/components/about/LayoutEquipe';
import { env } from '@/config/env';
import { useEmployeeStore } from '@/store/employeeStore';

export const dynamic = 'force-dynamic';



export default function AboutPage() {    
    
  const {employees, getEmployees, loading, error} = useEmployeeStore();

  useEffect(()=>{
    getEmployees();
  },[])


  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className='min-h-[80vh]'>

      <div className='h-max'>
      {
          employees && employees.length > 0 &&
          <div className='max-w-7xl mx-auto'>
            
            <div className='px-4 sm:px-6 lg:px-8'>
              <div>
                <h2 className='md:leading-loose text-xl md:text-2xl text-slate-700 font-bold tracking-tight'>Rencontrez notre équipe de vente</h2>
                <p className='tracking-wider'>Des professionels dévoués au service de notre réussite</p>
              </div>
            </div>

            <LayoutEquipe employees={employees} className='my-10 md:my-20 px-4 sm:px-6 lg:px-8'/>        
          
          </div>
      }
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
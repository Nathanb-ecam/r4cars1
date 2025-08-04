'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname, useParams } from 'next/navigation';
import { Locale, routing } from '@/i18n/routing';
import LocaleSwitcher from './ui/LocaleSwitcher';




export default function Header() {
  const router = useRouter();  
  const pathname = usePathname(); 
  const locale = pathname.split('/')[1] || 'fr';

  // const isLegalPage = pathname.includes('/legal/');
  const isLegalPage = true

  

const handleLocaleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  const locale = e.target.value;
  const pathname = window.location.pathname;
  const segments = pathname.split('/');

  // Replace the locale segment (assumed to be at index 1)
  if(routing.locales.includes(segments[1] as Locale)) {
    segments[1] = locale;
    const newPath = segments.join('/');
    router.push(newPath);
    // window.location.href = newPath;
  }

};


  return (
    // bg-gray-900
    <header className="bg-slate-900 text-black shadow-md fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
        <div className="flex justify-between items-center h-16">
          
          {/* <div className='relative h-1/2 w-[120px]'>
            <Image src="/images/LEM_Logo_White.png" alt='logo' fill/>
          </div> */}
                   

          <Link href="/home">                    
            <Image
              src={"/brand-images/logo_entier_alt2.svg"}
              alt="Logo"
              width={ 120}            
              height={10}
              className='mt-5 text-white text-3xl font-bold'
            />
          </Link>

            
          <div className='flex items-center gap-10'>
            <ul className='flex items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-400 font-medium'>
              <li><Link href="/home">Nos véhicules</Link></li>
              <li><Link href="/about">A propos</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
                          
            {/* <div className="flex items-center gap-2 md:gap-4">  
              <LocaleSwitcher></LocaleSwitcher>            
            </div> */}
          </div>
          

        </div>
      </div>
    </header>
  );
} 
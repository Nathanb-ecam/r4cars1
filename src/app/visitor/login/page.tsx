'use client';

import VisitorLoginForm from '@/components/auth/VisitorLoginForm';
import Image from 'next/image';


export default function VisitorLoginPage() {
  
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">    
      <div className="max-w-md w-full space-y-8 bg-slate-800 rounded-md py-5 flex flex-col items-center">
        <div>
          {/* <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Welcome to Labeuromed            
          </h2> */}
           <div className="relative w-[160px] h-10"> {/* Use h-10, h-12, etc. */}
              <Image src="/images/LEM_Logo_White.png" alt="logo" fill />
           </div>
          <p className="mt-2 text-center text-sm text-gray-600">
            Please enter your access code.
          </p>
        </div>
        <VisitorLoginForm></VisitorLoginForm>
      </div>
    </div>
  );
}

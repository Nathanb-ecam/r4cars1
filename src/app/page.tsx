'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import Cookies from 'js-cookie';

interface LoginForm {
  doctorNumber: string;
  prescriptionNumber: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const { register, handleSubmit } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    // Here you would typically validate against your backend
    // For now, we'll just do a simple validation
    if (data.doctorNumber.length >= 5 && data.prescriptionNumber.length >= 5) {
      // Set authentication cookie
      Cookies.set('authenticated', 'true', { expires: 7 }); // Expires in 7 days
      // Store doctor number for affiliate tracking
      Cookies.set('doctorNumber', data.doctorNumber, { expires: 7 });
      router.push('/home');
    } else {
      setError('Invalid doctor or prescription number');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Welcome to Labeuromed
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Please enter your credentials to continue
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="doctorNumber" className="sr-only">
                Doctor Number
              </label>
              <input
                {...register('doctorNumber')}
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Doctor Number"
              />
            </div>
            <div>
              <label htmlFor="prescriptionNumber" className="sr-only">
                Access code
              </label>
              <input
                {...register('prescriptionNumber')}
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Access code"
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

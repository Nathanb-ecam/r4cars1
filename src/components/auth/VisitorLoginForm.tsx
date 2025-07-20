'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function VisitorLoginForm() {
  const router = useRouter();
  const [accessCode, setAccessCode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('/api/visitor/affiliate-refcode-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({accessCode}),      
      });

      const data = await response.json();
      // console.log("AFFILIATE_REFCODE_LOGIN")
      // console.log(data)

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      const {affiliate_id, _} = data
      
      // Cookies.set('doctorTag',formData.doctorIdentificationNumber);
      // Cookies.set('refCode',formData.refCode);      
      Cookies.set('affiliate_id',affiliate_id);      
      router.push('/visitor/screens/home');
    } catch (error) {
      // setError(error instanceof Error ? error.message : 'An error occurred');
      setError('Something went wrong. Please try again later');
    }
  };

  return (
    <form className="my-2 flex flex-col gap-2" onSubmit={handleSubmit}>
      <div className="rounded-md shadow-sm -space-y-px">

        <div>
          <label htmlFor="accessCode" className="sr-only">
            Access Code
          </label>
          <input
            id="accessCode"
            name="accessCode"
            type="text"
            required
            className="
            appearance-none text-lg rounded-md relative block w-full px-3 py-2 
            border border-gray-300 placeholder-gray-500 text-gray-900 
            focus:outline-none focus:ring-lime-500 focus:border-lime-500 focus:border-2 focus:z-10 sm:text-sm
            focus:outline-none focus:ring-0 focus:border-inherit
            "
            placeholder="Access Code"
            value={accessCode}
            onChange={(e) =>
              setAccessCode(e.target.value.toUpperCase())
            }
          />
        </div>
      </div>

      {error && (
        <div className="text-red-500 text-sm text-center">{error}</div>
      )}

      <div>
        <button
          type="submit"
          className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-lime-500 hover:bg-lime-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Verify
        </button>
      </div>
    </form>
  );
} 
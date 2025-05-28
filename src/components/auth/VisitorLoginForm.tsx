'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function VisitorLoginForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    doctorNumber: '',
    accessCode: '',
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('/api/auth/access-code-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      router.push('/visitor/home');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      <div className="rounded-md shadow-sm -space-y-px">
        <div>
          <label htmlFor="doctorNumber" className="sr-only">
            Doctor Number
          </label>
          <input
            id="doctorNumber"
            name="doctorNumber"
            type="text"
            required
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="Doctor Number"
            value={formData.doctorNumber}
            onChange={(e) =>
              setFormData({ ...formData, doctorNumber: e.target.value })
            }
          />
        </div>
        <div>
          <label htmlFor="accessCode" className="sr-only">
            Access Code
          </label>
          <input
            id="accessCode"
            name="accessCode"
            type="password"
            required
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="Access Code"
            value={formData.accessCode}
            onChange={(e) =>
              setFormData({ ...formData, accessCode: e.target.value })
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
          className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Verify
        </button>
      </div>
    </form>
  );
} 
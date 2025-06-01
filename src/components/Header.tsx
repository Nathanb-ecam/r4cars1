'use client';

import Link from 'next/link';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import { useCartStore } from '@/store/cartStore';

export default function Header() {
  const items = useCartStore((state) => state.items);
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    // bg-gray-900
    <header className="bg-slate-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* <Link href="/" className="text-2xl font-bold text-gray-900"> */}
          <div>

            <span className='text-gray-300 font-bold'>lab</span>
            <span className='text-gray-600 font-light tracking-tight'>euromed</span>
          </div>
          {/* </Link> */}
          <div className="flex items-center space-x-4">
            <Link href="/visitor/cart" className="relative">
              <ShoppingCartIcon className="h-6 w-6 text-gray-200" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
} 
'use client';

import Link from 'next/link';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import { useCartStore } from '@/store/cartStore';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  // Extract locale from pathname (e.g., /en/..., /fr/..., /es/...)
  const locale = pathname.split('/')[1] || 'en';

  const items = useCartStore((state) => state.items);
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const handleLocaleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const loc = e.target.value;
    // Replace the first segment with the new locale
    const segments = pathname.split('/');
    segments[1] = loc;
    const newPath = segments.join('/') || '/';
    router.replace(newPath);
  };

  return (
    // bg-gray-900
    <header className="bg-slate-800 text-white shadow-md fixed w-full z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
        <div className="flex justify-between items-center h-16">
          
          {/* <div className='relative h-1/2 w-[120px]'>
            <Image src="/images/LEM_Logo_White.png" alt='logo' fill/>
          </div> */}
          
          <Link href="/visitor/screens/home">
            <div className="relative w-[160px] h-10"> {/* Use h-10, h-12, etc. */}
              <Image src="/images/LEM_Logo_White.png" alt="logo" fill />
            </div>
          </Link>


          
          <div className="flex items-center gap-4">
            <select value={locale} onChange={handleLocaleChange} className="text-black rounded px-2 py-1">
              <option value="en">🇬🇧 English</option>
              <option value="fr">🇫🇷 Français</option>
              <option value="es">🇪🇸 Español</option>
            </select>
            <Link href="/visitor/screens/cart" className="relative">
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
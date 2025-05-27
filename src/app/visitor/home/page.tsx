'use client';

import { useCartStore } from '@/store/cartStore';
import Link from 'next/link';
import Image from 'next/image';
import { products } from '@/data/products';

export default function HomePage() {
  const addItem = useCartStore((state) => state.addItem);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <Link href={`/product/${product.id}`}>
              <div className="relative h-48 w-full">
                <Image                  
                  // src={product.imageUrl}
                  src="/images/anabolisants.png"
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {product.name}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {product.description}
                </p>
                <p className="mt-2 text-lg font-bold text-gray-900">
                  ${product.price.toFixed(2)}
                </p>
              </div>
            </Link>
            <div className="px-4 pb-4">
              <button
                onClick={() => addItem(product)}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
} 
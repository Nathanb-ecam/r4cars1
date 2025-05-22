'use client';

import { useCartStore } from '@/store/cartStore';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { products } from '@/data/products';

export default function ProductPage() {
  const params = useParams();
  const addItem = useCartStore((state) => state.addItem);
  
  const product = products.find((p) => p.id === params.id);

  if (!product) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p>Product not found</p>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative h-96 w-full">
          <Image
            // src={product.imageUrl}
            src="/images/anabolisants.png"
            alt={product.name}
            fill
            className="object-cover rounded-lg"
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
          <p className="mt-4 text-lg text-gray-500">{product.description}</p>
          <p className="mt-4 text-2xl font-bold text-gray-900">
            ${product.price.toFixed(2)}
          </p>
          <button
            onClick={() => addItem(product)}
            className="mt-6 w-full bg-indigo-600 text-white py-3 px-6 rounded-md hover:bg-indigo-700 transition-colors"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </main>
  );
} 
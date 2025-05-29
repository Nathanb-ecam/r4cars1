'use client';

import { useCartStore, Product as CartProduct } from '@/store/cartStore';
import { useProductStore } from '@/store/productStore';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect } from 'react';
import { Product } from '@/models/Product';
import PriceDiscount from '@/components/visitor/PriceDiscount';

export default function HomePage() {
  const addItem = useCartStore((state) => state.addItem);
  const { products, isLoading, error, fetchProducts } = useProductStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleAddToCart = (product: Product) => {
    // const cartProduct: CartProduct = {
    //   id: product._id,
    //   name: product.name,
    //   description: product.description,
    //   price: product.price,
    //   imageUrl: product.image || '/images/anabolisants.png',
    // };
    addItem(product);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center py-8">
        {error}
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product._id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <Link href={`/visitor/product/${product._id}`}>
              <div className="relative h-48 w-full">
                <Image
                  src={product.imageUrl || '/images/anabolisants.png'}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {product.name}
                </h3>
                <p className="mt-1 text-sm text-gray-500 h-25 line-clamp-3 min-h-[4.5em]">
                  {product.description}
                </p>
                <div className='flex'>
                  <PriceDiscount product={product}></PriceDiscount>                               
                </div>
              </div>
            </Link>

            <div className="px-4 pb-4">
              <button
                onClick={() => handleAddToCart(product)}
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
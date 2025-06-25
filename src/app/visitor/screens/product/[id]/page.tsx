'use client';

import PriceDiscount from '@/components/visitor/PriceDiscount';
import { useCartStore } from '@/store/cartStore';
import { useProductStore } from '@/store/productStore';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ProductPage() {
  const params = useParams();
  const addItem = useCartStore((state) => state.addItem);
  const { products, isLoading, error, fetchProducts, getProductById } = useProductStore();

  
  useEffect(() => {
    if (products.length === 0) {
      fetchProducts();
    }
  }, [products.length, fetchProducts]);

  const product = getProductById(params.id as string);
  const imgSource = product?.imageUrl ?? "g5-no-bg.png" // need to repalce with a placeholder image 
  const [imgSrc, setImgSrc] = useState(product?.imageSelfHosted ? `/images/${imgSource}` : product?.imageUrl);
console.log(imgSrc)
  if (isLoading) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-red-500 text-center">Product not found</p>
      </main>
    );
  }

  const handleAddToCart = () => {
    // const cartProduct = {
    //   id: product._id,
    //   name: product.name,
    //   description: product.description,
    //   price: product.price,
    //   imageUrl: product.image || '/images/g5-no-bg.png',
    // };
    addItem(product);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/visitor/screens/home" className="text-2xl font-bold text-gray-900">        
        <div className='mb-5 flex items-center gap-2'>
          <ArrowLeftIcon className="h-4 w-4 text-gray-600" />
          <p className='text-sm text-gray-700 border-b border-b-gray-300 '>Tous nos produits</p>
        </div>
      </Link>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative h-96 w-full">
          <Image
            src={imgSrc}
            alt={product.name}
            onError={()=>setImgSrc("/images/g5-no-bg.png")}
            fill
            className="object-contain rounded-lg"
          />
        </div>
        <div>
          <h1 className="md:text-xl font-bold text-gray-900">{product.name}</h1>
          <p className=" mt-1 mb-4 text-sm md:text-md text-gray-500">{product.description}</p>
          
          <div className="flex justify-between flex-col">
            <div className='md:hidden'>
              <PriceDiscount product={product} textSize="S"></PriceDiscount>
            </div>
            <div className='hidden md:block'>
              <PriceDiscount product={product} textSize="L"></PriceDiscount>
            </div>
            <button
              onClick={handleAddToCart}
              className="mt-2 bg-lime-500 w-full text-sm md:text-md text-white py-3 px-6 rounded-md hover:bg-lime-600 transition-colors"
            >
              Add to Cart
            </button>
          </div>
          
          {/* <p className="mt-2 text-sm text-gray-500">
            Stock: {product.stock}
          </p> */}
        </div>
      </div>
    </main>
  );
} 
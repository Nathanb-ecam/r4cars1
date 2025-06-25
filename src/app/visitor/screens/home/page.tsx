'use client';

import { useCartStore } from '@/store/cartStore';
import { useProductStore } from '@/store/productStore';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect } from 'react';
import { Product } from '@/models/Product';
import PriceDiscount from '@/components/visitor/PriceDiscount';
import HomeProductSection from '@/components/visitor/HomeProductSection';

export default function HomePage() {
  const addItem = useCartStore((state) => state.addItem);
  const { products, isLoading, error, fetchProducts } = useProductStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleAddToCart = (product: Product) => {
    addItem(product);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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
        
        <HomeProductSection title='Nos offres du moment' products={products.filter(product => product.isSpecialOffer === true && product.visibleOnWebsite === true)} handleAddToCart={handleAddToCart}></HomeProductSection>
        {/* <HomeProductSection title='Tous nos produits' products={products.filter(product => (product.isSpecialOffer === undefined || product.isSpecialOffer === false) && (product.visibleOnWebsite === true))} handleAddToCart={handleAddToCart}></HomeProductSection> */}
        <HomeProductSection title='Tous nos produits' products={products.filter(product => product.visibleOnWebsite === true)} handleAddToCart={handleAddToCart}></HomeProductSection>
        
    </main>
  );
} 
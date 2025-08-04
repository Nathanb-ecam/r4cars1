"use client";
import { useProductStore } from '@/store/productStore';
import { useEffect } from 'react';
import HomeProductSection from '@/components/visitor/HomeProductSection';
import { useTranslations } from 'next-intl';

export const dynamic = 'force-dynamic';



export default function HomePage() {    
  
  const t = useTranslations('Home');  
  const { products, isLoading, error, fetchProducts } = useProductStore();

  useEffect(() => {
    fetchProducts();
  }
  ,[]);
  // ,[fetchProducts]);

  console.log("Products:",products)

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
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 px-4 md:py-8">        
        <HomeProductSection 
        title={t('allProducts')}         
        products={
          products.filter(product => 
            // (product.isSpecialOffer === undefined || product.isSpecialOffer === false) && 
            (product.visibleOnWebsite === true)
          )
        } 
        />
    </main>
  );
} 
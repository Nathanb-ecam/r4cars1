"use client";
import { useProductStore } from '@/store/productStore';
import { useEffect, useState } from 'react';
import HomeProductSection from '@/components/visitor/HomeProductSection';
import { useTranslations } from 'next-intl';


export const dynamic = 'force-dynamic';

export default function HomePage() {
  const t = useTranslations('Home');
  const { products, isLoading, error, fetchProducts, total } = useProductStore();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    fetchProducts(currentPage, itemsPerPage);
  }, [currentPage]);

  const totalPages = Math.ceil(total / itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
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
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 md:py-8">
      <HomeProductSection
        title={t('allProducts')}
        products={products}
      />

      {/* Pagination Controls */}
      <div className="flex justify-center mt-8 pb-4 gap-2">
        <button className='mr-2 border border-gray-200 px-2 py-1 rounded-lg' disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>
          ← Précédent
        </button>
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            // variant={currentPage === i + 1 ? 'default' : 'outline'}
            onClick={() => handlePageChange(i + 1)}
            className={`text-gray-500 ${currentPage === i + 1 ? 'underline decoration-gray-500 underline-offset-2 font-bold' : ''}`}
          >
            {i + 1}
          </button>
        ))}
        <button className={`ml-2 border border-gray-200 px-2 py-1 rounded-lg ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)}>
          Suivant →
        </button>
      </div>
    </main>
  );
}

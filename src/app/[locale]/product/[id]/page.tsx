"use client";
import Modal from '@/components/Modal';
import { useProductStore } from '@/store/productStore';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { ShoppingCartIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import ProductSpecs from '@/components/visitor/ProductSpecs';

export default function ProductPage() {
  const params = useParams();
  const { products, isLoading, error, fetchProducts, getProductById } = useProductStore();  
  const t = useTranslations('Product');

  useEffect(() => {
    if (products.length === 0) {
      fetchProducts();
    }
  }, [products.length, fetchProducts]);

  const product = getProductById(params.id as string);
  
  const [imgSrc, setImgSrc] = useState((product?.imageUrl && product?.imageUrl?.length > 0) ? product.imageUrl : "");

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
        <p className="text-red-500 text-center">{t('notFound')}</p>
      </main>
    );
  }


  return (
    <>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 md:py-8">
        <Link href="/home" className="text-2xl font-bold text-slate-900">
          <div className='mb-3 md:mb-5 flex items-center gap-2'>
            <ArrowLeftIcon className="h-4 w-4 text-gray-600" />
            <p className='text-sm text-gray-700 md:border-b tracking-tight border-b-gray-300 '>{t('backToProducts')}</p>
          </div>
        </Link>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className='flex flex-col gap-4'>
             <div className="relative h-64 w-full bg-gray-50 ">
               <Image
                 src={imgSrc ?? "/images/g5-no-bg.png"}
                 alt={product.name}
                 onError={()=>setImgSrc("/images/g5-no-bg.png")}
                 fill
                 className="object-cover rounded-lg"
                />
             </div>
            <ProductSpecs product={product} />
          </div>

          <div>
            <div className='flex flex-col'>
                <h1 className="md:text-xl font-bold text-gray-700">{product.name}<span></span></h1>                
                <p className="text-xs md:text-sm text-gray-600 tracking-wide">{product.fullName}</p>                            
            </div>
            <p className=" mt-4 mb-4 text-sm md:text-md text-gray-500">{product.description}</p>                            
            {product.sections && <div className="rounded-md py-2">
              {product.sections.map((section,sectionIdx)=>
                  <div key={`section-idx-${sectionIdx}`} className="mb-4">
                    <div className='font-medium tracking-wide'><span className='font-bold text-gray-800'>{sectionIdx + 1}. </span>{section.title}</div>
                    {/* {section.desc && <div className='mb-1 pl-1 text-light text-xs text-gray-600'>{section.desc}</div>} */}
                    <ul className="list-disc ml-10">
                      {section.blocks && section.blocks.map((component,idx)=>
                          // <div key={idx} className='text-xs font-medium text-gray-700 bg-gray-100 py-1 px-3 rounded-md'>
                          //   {component}
                          // </div>
                          <li key={idx} className='text-sm mt-1 text-gray-700'>
                            {component}
                          </li>
                       )}
                    </ul>
                  </div>
              )}
            </div>}
          </div>
          
          

        
        </div>
      </main>
    </>
  );
} 
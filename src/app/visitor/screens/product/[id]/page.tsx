'use client';

import Modal from '@/components/Modal';
import PriceDiscount from '@/components/visitor/PriceDiscount';
import { useCartStore } from '@/store/cartStore';
import { useProductStore } from '@/store/productStore';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { ShoppingCartIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ProductPage() {
  const params = useParams();
  const addItem = useCartStore((state) => state.addItem);
  const { products, isLoading, error, fetchProducts, getProductById } = useProductStore();

  const [addedToCartVisible, setAddedToCartVisible] = useState(false);
  const router = useRouter();
  
  useEffect(() => {
    if (products.length === 0) {
      fetchProducts();
    }
  }, [products.length, fetchProducts]);

  const product = getProductById(params.id as string);
  // const imgSource = product?.imageUrl ?? "g5-no-bg.png" // need to repalce with a placeholder image 
  // const [imgSrc, setImgSrc] = useState(product?.imageSelfHosted ? `/images/${imgSource}` : product?.imageUrl);
  const [imgSrc, setImgSrc] = useState((product?.imageUrl && product?.imageUrl?.length > 0) ? product.imageUrl : "");
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
    <>
      {addedToCartVisible && <Modal
                    title='New item added to order'
                    sentence={product.name} 
                    imageUrl={imgSrc}
                    isOpen={true} 
                    onPrimaryClicked={()=>router.push('/visitor/screens/cart')} 
                    primaryText="See basket"
                    secondaryText="Continue shopping"
                    onSecondaryClicked={()=>setAddedToCartVisible(false)}
                    secondaryVisible={true}                    
                    onClose={()=>setAddedToCartVisible(false)} 
                    />}

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
              src={imgSrc ?? "/images/g5-no-bg.png"}
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
              <div className='md:hidden flex justify-between items-center mr-2'>
                <PriceDiscount product={product} textSize="S"></PriceDiscount>
                {product.stock > 0 && <p className="mt-2 text-xs text-gray-500">(Stock: {product.stock})</p>}
              </div>
              <div className='hidden md:flex md:justify-between md:items-center md:mr-2'>
                <PriceDiscount product={product} textSize="L"></PriceDiscount>
                {product.stock > 0 && <p className="mt-2 text-xs text-gray-500">(Stock: {product.stock})</p>}
              </div>
              <div
                onClick={()=>{handleAddToCart(); setAddedToCartVisible(true);}}
                className="
                mt-2 bg-lime-500 w-full text-sm md:text-md text-white py-3 px-10 rounded-md hover:bg-lime-600 transition-colors
                flex items-center gap-5
                "
              >
                <ShoppingCartIcon className="h-6 w-6 text-gray-200" />
                <p className='font-medium text-white'>Add to Cart</p>
              </div>
            </div>
            

            {product.sections && <div className="mt-4 rounded-md py-2">
                {product.sections.map((section,sectionIdx)=>
                <div key={`section-idx-${sectionIdx}`}>
                  <div className='mb-2'>{section.title}</div>
                  {section.desc && <div className='text-light'>{section.desc}</div>}
                  <div className="flex gap-2">
                    {section.blocks && section.blocks.map((component,idx)=>
                      <div key={idx} className='text-xs font-medium text-gray-700 bg-gray-100 py-1 px-3 rounded-md'>
                          {component}
                      </div>
                    )}
                  </div>
                </div>
                )}
            </div>}

            {/* <div className='my-3 py-2 px-5 font-medium bg-gray-100'>
              <label>{product.conditionning}</label>
            </div> */}

          </div>
        </div>
      </main>
    </>
  );
} 
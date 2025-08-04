import { Product } from "@/models/Product";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { PrimaryButton } from "../ui/PrimaryButton";

interface Props{
    title:string;
    products:Product[];  
}

export default function HomeProductSection({title, products} : Props){      

  const t = useTranslations('HomeProductSection');  

     if(products.length === 0) return;    
    const router = useRouter();    

    return <>
                    
        <h1 className='mb-4 md:mb-8 text-2xl sm:text-3xl tracking-tight font-bold text-slate-700'>
            {title}
        </h1>

        <div className="mb-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {products.map((product) => {          
          const [imgSrc,setImgSrc] = useState(product.imageUrl.length > 0 ? product.imageUrl : '/images/g5-no-bg.png')
          return <div
            key={product._id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            {/* <Link href={`/product/${product._id}`}> */}
              <div className="relative h-48 w-full">
                <Image                
                  src={imgSrc}
                  alt={product.name}                  
                  fill
                  onError={() => setImgSrc("/images/g5-no-bg.png")}
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <div className="flex justify-between items-center">
                  <h3 className="md:text-lg font-bold text-gray-700">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-1">
                    <div className="bg-gray-100 text-xs text-gray-600 font-medium rounded-full px-2 py-1">{product.year}</div>
                    {/* <div className="bg-gray-100 text-xs text-gray-600 font-medium rounded-full px-2 py-1">{product.transmission}</div> */}
                    <div className="bg-gray-100 text-xs text-gray-600 font-medium rounded-full px-2 py-1">{product.kms} kms</div>
                  </div>
                </div>
                <p className="mt-1 text-xs md:text-sm text-gray-500 h-25 line-clamp-3 min-h-[4.5em]">
                  {product.description}
                </p>                                            
              </div>
            {/* </Link> */}
            <div className="flex justify-between items-center px-4 py-2">
              <div className="text-lg font-semibold text-slate-900">
                {product.originalPrice} €
              </div>
              <div className="text-end gap-2">                
                <PrimaryButton className="text-sm rounded-lg" text={t('viewDetails')} onClick={() => router.push(`/product/${product._id}`)} />
              </div>
            </div>
          </div>
        })}
      </div>
    </>
}
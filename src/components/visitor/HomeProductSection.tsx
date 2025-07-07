import { Product } from "@/models/Product";
import Image from "next/image";
import Link from "next/link";
import PriceDiscount from "./PriceDiscount";
import { useState } from "react";
import ConfirmationModal from "../Modal";
import Modal from "../Modal";
import { useRouter } from "next/navigation";

interface Props{
    title:string;
    products:Product[];
    handleAddToCart: (product:Product)=>void;
}

export default function HomeProductSection({title, products, handleAddToCart} : Props){    
    if(products.length === 0) return;
    const [addedToCartVisible, setAddedToCartVisible] = useState(false)
    const router = useRouter();
    const [itemToAdd, setItemToAdd] = useState({name:'New product',imageUrl:''})

    return <>

          {addedToCartVisible && <Modal
                    title='Item added to order'
                    imageUrl={itemToAdd.imageUrl} 
                    sentence={itemToAdd.name}
                    isOpen={true} 
                    onPrimaryClicked={()=>router.push('/visitor/screens/cart')} 
                    primaryText="See basket"
                    secondaryText="Continue shopping"
                    onSecondaryClicked={()=>setAddedToCartVisible(false)}
                    secondaryVisible={true}                    
                    onClose={()=>setAddedToCartVisible(false)} 
                    />}

                    
        <h1 className='mb-4 md:mb-8 text-2xl sm:text-3xl tracking-tight font-extrabold text-gray-800'>
            {title}
        </h1>

        <div className="mb-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {products.map((product) => {
           const [imgSrc, setImgSrc] = useState(
            product.imageSelfHosted ? `/images/${product.imageUrl }` : `${product.imageUrl}` || '/images/g5-no-bg.png'
          );
          return <div
            key={product._id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <Link href={`/visitor/screens/product/${product._id}`}>
              <div className="relative h-48 w-full">
                <Image
                //   src={product.imageUrl || '/images/g5-no-bg.png'}
                  src={imgSrc}
                  alt={product.name}                  
                  fill
                  onError={() => setImgSrc("/images/g5-no-bg.png")}
                  className="object-contain"
                />
              </div>
              <div className="bg-gray-50 p-4">
                <h3 className="md:text-lg font-semibold text-gray-900">
                  {product.name}
                </h3>
                <p className="mt-1 text-xs md:text-sm text-gray-500 h-25 line-clamp-3 min-h-[4.5em]">
                  {product.description}
                </p>                                            
              </div>
            </Link>

            <div className="bg-gray-50 px-4 pb-4 flex justify-between gap-2">
                <PriceDiscount textSize="S" product={product} isCol={false} ></PriceDiscount>                               
              <button
                onClick={() => {
                  setItemToAdd({
                    name: product.name, 
                    imageUrl:  product.imageSelfHosted ? `/images/${product.imageUrl }` : `${product.imageUrl}` || '/images/g5-no-bg.png'});
                  setAddedToCartVisible(true);
                  handleAddToCart(product);
                }}                
                className="transition-colors bg-lime-500 text-white text-xs px-5 py-2 rounded-lg hover:bg-lime-600"
              >
                Add to Cart
              </button>
            </div>
          </div>
        })}
      </div>
    </>
}
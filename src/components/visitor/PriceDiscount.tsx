import { Product } from '@/models/Product'
import React from 'react'

interface Props{
    product : Product
}
export default function PriceDiscount({product} : Props) {
    if(product.discountedPrice >= product.originalPrice){
        return <p className="mt-2 text-lg font-bold text-gray-900">
                    €{product.originalPrice.toFixed(2)}
                </p>
    }
        
    return (
    <div className='flex flex-col'>
        <p className="text-sm font-bold text-gray-900 line-through">
            €{product.originalPrice.toFixed(2)}
        </p>
        <p className="text-md font-bold text-gray-900">
            €{product.discountedPrice.toFixed(2)}
        </p>
    </div>
  )
}

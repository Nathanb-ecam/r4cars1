import { Product } from '@/models/Product'
import React from 'react'

interface Props{
    product : Product
    isCol?: boolean
}
export default function PriceDiscount({product, isCol} : Props) {
    if(product.discountedPrice >= product.originalPrice){
        return <p className="mt-2 text-lg font-bold text-gray-900">
                    €{product.originalPrice.toFixed(2)}
                </p>
    }
        
    return (
    <div className={`flex ${isCol ? 'flex-col' : 'items-center'}`}>
        <p className="text-xs font-bold text-gray-900 line-through">
            €{product.originalPrice.toFixed(2)}
        </p>
        {/* text-gray-900 */}
        <p className="text-md font-bold text-red-700"> 
            €{product.discountedPrice.toFixed(2)}
        </p>
    </div>
  )
}

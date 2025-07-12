import { Product } from '@/models/Product'
import React from 'react'

interface Props{
    product : Product
    textSize:string;
    isCol?: boolean
}
export default function PriceDiscount({product, textSize, isCol} : Props) {
    
    const discounted = {
        "XS": "xs",
        "S": "md",
        "M": "lg",
        "L": "xl"
    }

    const original = {
        "XS": "xs",
        "S": "xs",
        "M": "md",
        "L": "lg"
    }

    if(product.discountedPrice >= product.originalPrice){
        return <p className="mt-2 text-md font-bold text-gray-800">
                    €{product.originalPrice.toFixed(2)}
                </p>
    }
        
    return (
    <div className={`flex gap-1 ${isCol ? 'flex-col' : 'items-center'}`}>
        {/* text-xs */}
        <p className={`text-${original[textSize as keyof typeof original]} font-bold text-gray-800 line-through`}>
            €{product.originalPrice.toFixed(2)}
        </p>
        {/* text-gray-900 */}
        {/* text-md */}
        <p className={`text-${discounted[textSize as keyof typeof original]} font-bold text-red-700`}> 
            €{product.discountedPrice.toFixed(2)}
        </p>
    </div>
  )
}

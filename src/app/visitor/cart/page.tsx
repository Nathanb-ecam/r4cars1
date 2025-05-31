'use client';

import { useState } from 'react';
import { useCartStore } from '@/store/cartStore';
import Image from 'next/image';
import { ArrowLeftIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { loadStripe } from '@stripe/stripe-js';
import { trackAffiliateSale } from '@/utils/affiliate';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import CartCheckoutModal from '@/components/visitor/CartCheckoutModal';
import { ExtendedOrderGoAffPro, ExtendSchemaGoAffPro, GoAffProLineItem } from '@/models/GoAffPro';
import PriceDiscount from '@/components/visitor/PriceDiscount';

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export interface CustomerPersonalInfo {
  first_name: string;
  last_name: string;
  email: string;
  shipping_address: string;
}

export default function CartPage() {  
  const bypassPayment = true;
  const { items, removeItem, updateQuantity } = useCartStore();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const subtotalRaw = items.reduce(
    (sum, item) => sum + Math.min(item.discountedPrice, item.originalPrice) * item.quantity, 0
  );
  const subtotal = Math.round(subtotalRaw * 10) / 10;  
  const shippingCost = 7;
  
  const totalRaw = subtotal + shippingCost;
  const total = Math.round(totalRaw * 10) / 10;
  // const total = subtotal
  

  const handleCheckout = async (customerPersonalInfo: CustomerPersonalInfo) => {
    console.log("Cart Page is Handling checkout")
    try {
      setIsProcessing(true);
 

      if(!bypassPayment){
          // Create Stripe checkout session
          const response = await fetch('/api/create-checkout-session', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              items,
              customer: customerPersonalInfo,              
            }),
          });

          const { sessionId } = await response.json();
              // Redirect to Stripe checkout
          const stripe = await stripePromise;
          const { error } = await stripe!.redirectToCheckout({ sessionId });

          if (error) {
            console.error('Stripe error:', error);
            throw error;
          }
      }

      // Track affiliate sale
      // const doctorTag = Cookies.get('doctorTag');
      // const doctorRefCode = Cookies.get('refCode');      
      // console.log("Tracing data", {doctorTag, doctorRefCode})
      const orderId = `ORDER-${Date.now()}`;  
      
      const line_items : GoAffProLineItem[] = items.map((item,_) => {
        
        return {
          name: item.name,
          sku: item.sku,
          price: Math.min(item.originalPrice,item.discountedPrice),
          quantity: item.quantity,
          product_id: item._id,
          tax: 0, // tax charged on this product
          discount: 0, // discount received on this product
        };
      });

      const extendedGoAffProOrder: ExtendedOrderGoAffPro = {
        id: orderId, // This will be set by the backend
        number: `#${orderId}`, // This will be set by the backend
        total,
        subtotal,
        shipping:shippingCost,
        discount: 0,
        tax: 0,
        currency: 'EUR',
        date: new Date().toISOString(),
        shipping_address: customerPersonalInfo.shipping_address,
        customer: customerPersonalInfo,
        coupons: ["EASY10OFF"],
        line_items: line_items, // Take the first line item to satisfy the tuple type
        status: 'approved',
        forceSDK: true
      };

      const affiliate_id = Cookies.get('affiliate_id');
      console.log("AFFILIATE ID BEFORE ORDER")
      console.log(affiliate_id)      


      if (affiliate_id) { // use extended goaffPro order schema        
        const extendedSchema : ExtendSchemaGoAffPro = {order:extendedGoAffProOrder,"affiliate_id": parseInt(affiliate_id)}
        await trackAffiliateSale(
            extendedSchema
        );
      }else{ // use base order goaffPro schema
          console.log("No valid affiliate_id found for this refferal")
      }
      


      // Clear cart and authentication
      useCartStore.getState().clearCart();      
      Cookies.remove('authenticated');
      Cookies.remove('doctorTag');
      Cookies.remove('refCode');
      Cookies.remove('affiliate_id');
      Cookies.remove('token');
      
      // Close the modal
      setIsCheckoutOpen(false);
    } catch (error) {
      console.error('Error processing order:', error);
      setIsProcessing(false);
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/visitor/home" className="text-2xl font-bold text-gray-900">        
        <div className='mb-5 flex items-center gap-2'>
          <ArrowLeftIcon className="h-4 w-4 text-gray-600" />
          <p className='text-sm text-gray-700 border-b border-b-gray-300'>Tous nos produits</p>
        </div>
      </Link>

      <h1 className="text-2xl font-bold mb-8">Shopping Cart</h1>      
      {items.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item._id}
              className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow"
            >
              <div className="relative h-24 w-24 flex-shrink-0">
                <Image
                  src={item.imageUrl ?? "/images/anabolisants.png"}
                  alt={item.name}
                  fill
                  className="object-cover rounded"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{item.name}</h3>
                {/* <p className="text-gray-600">€{Math.min(item.discountedPrice, item.originalPrice).toFixed(2)}</p> */}
                <PriceDiscount product={item}></PriceDiscount>
              </div>
              <div className="flex items-center space-x-4">
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) =>
                    updateQuantity(item._id, parseInt(e.target.value))
                  }
                  className="w-20 px-2 py-1 border rounded"
                />
                <button
                  onClick={() => removeItem(item._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
            </div>
          ))}

          <div className="mt-8 flex justify-between items-center">
            <div className="text-xl font-bold">
              Total: €{subtotal.toFixed(2)}
            </div>

            <button
              onClick={() => setIsCheckoutOpen(true)}
              className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700"
            >
              Checkout
            </button>
          </div>
        </div>
      )}

      <CartCheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onSubmit={handleCheckout}
        isProcessing={isProcessing}
        subtotal={subtotal}
        shippingCost={shippingCost}
        total={total}        
      />
    </main>
  );
} 
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
import Modal from '@/components/Modal';
import {BrevoOrderConfirmationTemplate} from '@/lib/email';

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export interface CustomerPersonalInfo {
  first_name: string;
  last_name: string;
  email: string;
  shipping_address: string;
}

export default function CartPage(){  

  const bypassPayment = true;
  const { items, removeItem, updateQuantity } = useCartStore();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderConfirmationVisible,setOrderConfirmationVisible] = useState(false);
  const [orderFailed,setOrderFailed] = useState(false);
  const [rerenderCount, setRerenderCount] = useState(0);

  const subtotalRaw = items.reduce(
    (sum, item) => sum + Math.min(item.discountedPrice, item.originalPrice) * item.quantity, 0
  );
  const subtotal = Math.round(subtotalRaw * 10) / 10;  
  const shippingCost = subtotal > 60 ? 0 : 7;
  
  const totalRaw = subtotal + shippingCost;
  const total = Math.round(totalRaw * 10) / 10;  
  // const total = subtotal
  


  const sendMailConfirmation = async ({ toEmail, toName }: {toEmail:string, toName:string}) => {
  try {
    const orderTemplate : BrevoOrderConfirmationTemplate = {
      name:toName,
      total:total.toString(),
      shippingCosts:shippingCost.toString(),
      products:items
    } 
    // console.log("CLIENT"+ toEmail + toName)
    const response = await fetch('/api/mail', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ toEmail, toName, orderTemplate }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Échec de l’envoi de l’email');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur lors de l’envoi de l’email :', error);
    throw error;
  }
};


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
      
      // const line_items : GoAffProLineItem[] = items.map((item,_) => {
        
      //   return {
      //     name: item.name,
      //     sku: item.sku,
      //     price: Math.min(item.originalPrice,item.discountedPrice),
      //     quantity: item.quantity,
      //     product_id: item._id,
      //     tax: 0, // tax charged on this product
      //     discount: 0, // discount received on this product
      //   };
      // });

      const line_items: GoAffProLineItem[] = items.map((item) => ({
        name: item.name,
        sku: item.sku,
        price: Math.min(item.originalPrice, item.discountedPrice), // always full price
        quantity: item.quantity,
        product_id: item._id,
        tax: 0,
        discount: item.originalPrice - Math.min(item.originalPrice, item.discountedPrice),
      }));

     
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
        // coupons: ["EASY10OFF"],
        line_items: line_items, // Take the first line item to satisfy the tuple type
        status: 'approved',
        forceSDK: true
      };

      console.log("DEBUGGING ORDER TOTAL")
      console.log(extendedGoAffProOrder)
      console.log()

      const affiliate_id = Cookies.get('affiliate_id');
      console.log("AFFILIATE ID BEFORE ORDER")
      console.log(affiliate_id)      


      if (affiliate_id) { // use extended goaffPro order schema        
        const extendedSchema : ExtendSchemaGoAffPro = {order:extendedGoAffProOrder,"affiliate_id": parseInt(affiliate_id)}
        const succesfullyCreated = await trackAffiliateSale(
            extendedSchema
        );
        if(succesfullyCreated) {setOrderConfirmationVisible(true); sendMailConfirmation({toEmail:customerPersonalInfo.email, toName:`${customerPersonalInfo.first_name} ${customerPersonalInfo.last_name}`}) }
      }else{ // use base order goaffPro schema
          console.log("No valid affiliate_id found for this refferal")
          setOrderFailed(true)
      }
      


      // Clear cart and authentication
      useCartStore.getState().clearCart();      
      Cookies.remove('authenticated');
      // Cookies.remove('doctorTag');
      // Cookies.remove('refCode');
      // Cookies.remove('affiliate_id');
      
      //remove the httpOnly token 
      // response.cookies.set('token', '', {
      //   httpOnly: true,
      //   secure: process.env.NODE_ENV === 'production',
      //   sameSite: 'strict',
      //   maxAge: 0, // expires immediately
      // });


      
      // Close the modal
      setIsCheckoutOpen(false);
    } catch (error) {
      console.error('Error processing order:', error);
      setIsProcessing(false);      
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {orderConfirmationVisible && <Modal 
        title="Order confirmation" 
        sentence="Your order has been placed. Thank you!" 
        isOpen={true}                 
        onPrimaryClicked={()=>setOrderConfirmationVisible(false)} 
        primaryText='Finish'
        onClose={()=>setOrderConfirmationVisible(false)}
        />}
        
      {orderFailed && <Modal 
        title="Something went wrong" 
        sentence="An issue occured while trying to save your order." 
        isOpen={true}                 
        onPrimaryClicked={()=>setOrderFailed(false)} 
        primaryText='Ok'
        onClose={()=>setOrderFailed(false)}
        />}

        

      <Link href="/visitor/screens/home" className="text-2xl font-bold text-gray-900">        
        <div className='mb-5 flex items-center gap-2'>
          <ArrowLeftIcon className="h-4 w-4 text-gray-600" />
          <p className='text-sm text-gray-700 border-b border-b-gray-300'>Tous nos produits</p>
        </div>
      </Link>

      <h1 className="text-2xl font-bold mb-8 tracking-tight">Shopping Cart</h1>      
      {items.length === 0 ? (
        <div className='mb-1 text-center bg-gray-50 py-20 px-2 rounded-lg'>
          <h2 className='font-medium md:text-xl text-gray-800 tracking-tight'>Your cart is empty</h2>  
          <p className='mt-1 mb-5 text-xs'>Go to products page and start adding elements.</p>        
          <span className=' border-b border-b-lime-600 mx-2 text-sm text-lime-600'><Link href="/visitor/screens/home">See products</Link></span>
          
          
          
          {/* <button
            // className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-md px-5 py-2 transition duration-300 ease-in-out transform hover:scale-102"            
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
            >                             
            </button> */}
          
          
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => {
            
            return <div
              key={item._id}
              className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow"
            >
              <div className="relative h-24 w-24 md:h-40 md:w-40 flex-shrink-0">
                <Image
                  // src={imgSrc}                
                  // src={item.imageSelfHosted ? (item?.imageUrl ? `images/${item?.imageUrl}`: "/images/g5-no-bg.png" ) : (item.imageUrl) || '/images/g5-no-bg.png'}
                  src={item.imageUrl}
                  alt={item.name}
                  // onError={()=>setImgSrc("/images/g5-no-bg.png")}
                  fill
                  className="object-contain rounded"
                />
              </div>
              <div className="hidden sm:block flex-1">
                <h3 className="text-sm md:text-lg font-semibold">{item.name}</h3>                
                <PriceDiscount textSize="S" product={item} isCol={false}></PriceDiscount>
              </div>
              <div className="flex-1 sm:hidden">
                <h3 className="text-sm md:text-lg font-semibold">{item.name}</h3>                
                <PriceDiscount textSize="XS" product={item} isCol={true}></PriceDiscount>
              </div>
              <div className="flex items-center sm:space-x-4">
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) =>
                    updateQuantity(item._id, parseInt(e.target.value))
                  }
                  className="w-[3rem] sm:w-20 px-2 py-1 border rounded"
                />
                <button
                  onClick={() => removeItem(item._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
            </div>
          })}
        </div>
      )}

      {
        items && items.length > 0 &&
          <div className="mt-8 flex justify-between items-center">
            <div>
              {/* <div className="text-xs font-bold">
                Sous-total: €{subtotal.toFixed(2)}
              </div>
              <div className="text-xs font-bold">
                Livraison: €{shippingCost.toFixed(2)}
              </div> */}
              <div className="text-md font-bold">
                Total: €{(shippingCost+ subtotal).toFixed(2)}
              </div>
            </div>

            <button
              onClick={() => setIsCheckoutOpen(true)}
              className="bg-lime-500 text-sm sm:text-md text-white px-6 py-2 rounded-md hover:bg-lime-600"
            >
              Checkout
            </button>
          </div>
      }

      <CartCheckoutModal
        key={rerenderCount}
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
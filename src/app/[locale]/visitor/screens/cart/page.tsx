"use client";
import { useState } from 'react';
import { useCartStore } from '@/store/cartStore';
import Image from 'next/image';
import { ArrowLeftIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { trackAffiliateSale } from '@/utils/affiliate';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import CartCheckoutModal from '@/components/visitor/CartCheckoutModal';
import { ExtendedOrderGoAffPro, ExtendSchemaGoAffPro, GoAffProLineItem } from '@/models/GoAffPro';
import PriceDiscount from '@/components/visitor/PriceDiscount';
import Modal from '@/components/Modal';
import {BrevoOrderConfirmationTemplate} from '@/lib/email';
import { useTranslations } from 'next-intl';

export const dynamic = 'force-dynamic';
export interface CustomerPersonalInfo {
  first_name: string;
  last_name: string;
  email: string;
  shipping_address: string;
}

export default function CartPage(){  
  const t = useTranslations('Cart');
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

  const sendMailConfirmation = async ({ toEmail, toName }: {toEmail:string, toName:string}) => {
    try {
      const orderTemplate : BrevoOrderConfirmationTemplate = {
        name:toName,
        total:total.toString(),
        shippingCosts:shippingCost.toString(),
        products:items
      } 
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
    try {
      setIsProcessing(true);
      // Stripe logic removed
      // ... keep affiliate and order logic ...
      const orderId = `ORDER-${Date.now()}`;  
      const line_items: GoAffProLineItem[] = items.map((item) => ({
        name: item.name,
        sku: item.sku,
        price: Math.min(item.originalPrice, item.discountedPrice),
        quantity: item.quantity,
        product_id: item._id,
        tax: 0,
        discount: item.originalPrice - Math.min(item.originalPrice, item.discountedPrice),
      }));
      const extendedGoAffProOrder: ExtendedOrderGoAffPro = {
        id: orderId,
        number: `#${orderId}`,
        total,
        subtotal,
        shipping:shippingCost,
        discount: 0,
        tax: 0,
        currency: 'EUR',
        date: new Date().toISOString(),
        shipping_address: customerPersonalInfo.shipping_address,
        customer: customerPersonalInfo,
        line_items: line_items,
        status: 'approved',
        forceSDK: true
      };
      const affiliate_id = Cookies.get('affiliate_id');
      if (affiliate_id) {
        const extendedSchema : ExtendSchemaGoAffPro = {order:extendedGoAffProOrder,"affiliate_id": parseInt(affiliate_id)}
        const succesfullyCreated = await trackAffiliateSale(
            extendedSchema
        );
        if(succesfullyCreated) {
          setOrderConfirmationVisible(true); 
          sendMailConfirmation({toEmail:customerPersonalInfo.email, toName:`${customerPersonalInfo.first_name} ${customerPersonalInfo.last_name}`});
        }        
        else setOrderFailed(true)
      }else{
        console.log("FAILED: affiliate_id not found")
        setOrderFailed(true);
      }
      useCartStore.getState().clearCart();            
      setIsCheckoutOpen(false);
    } catch (error) {
      console.error('Error processing order:', error);
      setIsProcessing(false);      
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {orderConfirmationVisible && <Modal 
        title={t('orderConfirmationTitle')} 
        sentence={t('orderConfirmationSentence')} 
        isOpen={true}                 
        onPrimaryClicked={()=>setOrderConfirmationVisible(false)} 
        primaryText={t('orderConfirmationPrimary')}
        onClose={()=>setOrderConfirmationVisible(false)}
        />}
      {orderFailed && <Modal 
        title={t('orderFailedTitle')} 
        sentence={t('orderFailedSentence')} 
        isOpen={true}                 
        onPrimaryClicked={()=>setOrderFailed(false)} 
        primaryText={t('orderFailedPrimary')}
        onClose={()=>setOrderFailed(false)}
        />}

      <Link href="/visitor/screens/home" className="text-2xl font-bold text-gray-900">        
        <div className='mb-5 flex items-center gap-2'>
          <ArrowLeftIcon className="h-4 w-4 text-gray-600" />
          <p className='text-sm text-gray-700 border-b border-b-gray-300'>{t('seeProducts')}</p>
        </div>
      </Link>

      <h1 className="text-2xl font-bold mb-8 tracking-tight">{t('title')}</h1>      
      {items.length === 0 ? (
        <div className='mb-1 text-center bg-gray-50 py-20 px-2 rounded-lg'>
          <h2 className='font-medium md:text-xl text-gray-800 tracking-tight'>{t('empty')}</h2>  
          <p className='mt-1 mb-5 text-xs'>{t('emptyCta')}</p>        
          <span className=' border-b border-b-lime-600 mx-2 text-sm text-lime-600'><Link href="/visitor/screens/home">{t('seeProducts')}</Link></span>
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
                {t('total')}: €{(shippingCost+ subtotal).toFixed(2)}
              </div>
            </div>

            <button
              onClick={() => setIsCheckoutOpen(true)}
              className="bg-lime-500 text-sm sm:text-md text-white px-6 py-2 rounded-md hover:bg-lime-600"
            >
              {t('checkout')}
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
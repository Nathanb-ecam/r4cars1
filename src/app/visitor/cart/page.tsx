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

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface CheckoutForm {
  name: string;
  email: string;
}

export default function CartPage() {
  const router = useRouter();
  const bypassPayment = true;
  const { items, removeItem, updateQuantity } = useCartStore();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const total = items.reduce((sum, item) => sum + Math.min(item.discountedPrice, item.originalPrice) * item.quantity, 0);
  
  const handleCheckout = async (formData: CheckoutForm) => {
    try {
      setIsProcessing(true);
      const orderId = `ORDER-${Date.now()}`;
      const doctorNumber = Cookies.get('doctorNumber');

      if(!bypassPayment){
          // Create Stripe checkout session
          const response = await fetch('/api/create-checkout-session', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              items,
              customer: formData,
              orderId,
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
      if (doctorNumber) {
        await trackAffiliateSale({
          doctorNumber,
          orderId,
          total,
        });
      }
      
      // register new order
      const response = await fetch('/api/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items,
          customer: formData,
          orderId,
        }),
      });

      // Clear cart and authentication
      useCartStore.getState().clearCart();      
      Cookies.remove('authenticated');
      Cookies.remove('doctorNumber');
      
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
                <p className="text-gray-600">€{Math.min(item.discountedPrice, item.originalPrice).toFixed(2)}</p>
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
              Total: €{total.toFixed(2)}
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
        total={total}
      />
    </main>
  );
} 
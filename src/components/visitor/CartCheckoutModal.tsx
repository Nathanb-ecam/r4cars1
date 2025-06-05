import { XMarkIcon } from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import MondialRelayWidget from '../mondial-relay/RelayWidget';
import { useCartStore } from '@/store/cartStore';
import { CustomerPersonalInfo } from '@/app/visitor/cart/page';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface CartCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: CustomerPersonalInfo) => Promise<void>;
  isProcessing: boolean;
  subtotal: number;
  shippingCost: number;
  total: number;
}

export default function CartCheckoutModal({
  isOpen,
  onClose,
  onSubmit,
  isProcessing,
  subtotal,
  shippingCost,
  total
}: CartCheckoutModalProps) {
  

  
  const [step, setStep] = useState(1);
  const [personalInfoData, setPersonalInfoData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    shipping_address: '',
  });  


  useEffect(() => {
    // Listen for changes to the Mondial Relay widget
    const checkMondialRelaySelection = setInterval(() => {
      const targetInput = document.getElementById('Target_Widget') as HTMLInputElement;
      if (targetInput && targetInput.value) {
        setPersonalInfoData(prev => ({ ...prev, shipping_address: targetInput.value }));
      }
    }, 1000);

    return () => clearInterval(checkMondialRelaySelection);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {      
      setStep(2);
    } else if(step === 2 ){
      // Validate all required fields
      if (!personalInfoData.first_name || !personalInfoData.last_name || !personalInfoData.email || !personalInfoData.shipping_address) {
        alert('Please fill in all required fields and select a Mondial Relay point');
        return;
      }
      setStep(3);
    }else {      
      
      await onSubmit(personalInfoData);
    }
  };


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-4 md:p-6 w-full max-w-md md:max-w-screen-lg mx-auto max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Checkout</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mb-4 md:mb-8">
          <div className="flex justify-between mb-2">
            <div className={`text-sm ${step >= 1 ? 'text-lime-500 font-medium' : 'text-gray-500'} flex flex-col justify-center items-center gap-2 `}>
              <h2 className={`${step >= 1 ? 'bg-lime-500 text-white' : 'bg-gray-50'} h-8 w-8 flex justify-center items-center gap-5 rounded-full`}>1</h2>
              <p>Summary</p>
            </div>
            <div className={`text-sm ${step >= 2 ? 'text-lime-500 font-medium' : 'text-gray-500'} flex flex-col justify-center items-center gap-2 `}>
              <h2 className={`${step >= 2 ? 'bg-lime-500 text-white' : 'bg-gray-50'} h-8 w-8 flex justify-center items-center gap-5 rounded-full`}>2</h2>
              <p>Personal Info</p>
            </div>
            <div className={`text-sm ${step >= 3 ? 'text-lime-500 font-medium' : 'text-gray-500'} flex flex-col justify-center items-center gap-2 `}>
              <h2 className={`${step >= 3 ? 'bg-lime-500 text-white' : 'bg-gray-50'} h-8 w-8 flex justify-center items-center gap-5 rounded-full`}>3</h2>
              <p>Payment</p>
            </div>  
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-lime-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step-1) * 50}%` }}
            />
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          { step === 1 && (
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium mb-2">Order Summary</h3>
                  <div className="flex justify-between mb-2">
                    <span>Subtotal:</span>
                    <span className="font-medium">€{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Shipping:</span>
                    <span className="font-medium">€{shippingCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Total Amount:</span>
                    <span className="font-medium">€{total.toFixed(2)}</span>
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm text-gray-600">
                      <strong>Shipping Address:</strong> {personalInfoData.shipping_address}
                    </p>
                  </div>
                </div>
                <div className='flex justify-between items-center'>
                  <p className="text-sm text-gray-600">
                    You will be redirected to complete your payment securely.
                  </p>
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="px-6 py-2 text-sm font-medium text-white bg-lime-500 rounded-md hover:bg-lime-600"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          
          
          {step === 2 && (
                  <div className="space-y-4">
                  <div className="flex gap-2 md:gap-5 flex-col md:flex-row">
                    <div className='flex-1'>
                      <label htmlFor="firstname" className="block text-sm font-medium text-gray-700">
                        Firstname *
                      </label>
                      <input
                        type="text"
                        id="firstname"
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        value={personalInfoData.first_name}
                        onChange={(e) => setPersonalInfoData({ ...personalInfoData, first_name: e.target.value })}
                      />
                    </div>
                    <div className='flex-1'>
                      <label htmlFor="lastname" className="block text-sm font-medium text-gray-700">
                        Lastname *
                      </label>
                      <input
                        type="text"
                        id="lastname"
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        value={personalInfoData.last_name}
                        onChange={(e) => setPersonalInfoData({ ...personalInfoData, last_name: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      value={personalInfoData.email}
                      onChange={(e) => setPersonalInfoData({ ...personalInfoData, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select a Mondial Relay Point *
                    </label>
                    <div className="border rounded-md p-2">
                      <MondialRelayWidget />
                    </div>
                    {personalInfoData.shipping_address && (
                      <p className="mt-2 text-sm text-gray-600">
                        Selected point: {personalInfoData.shipping_address}
                      </p>
                    )}
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      Back
                    </button>
                    <button
                      onClick={()=>setStep(3)}
                      className="px-6 py-2 text-sm font-medium text-white bg-lime-500 rounded-md hover:bg-lime-600"
                    >
                      Next
                    </button>
                  </div>
                </div>
          )}
    
          {step === 3 && (
                    <>
                    <div>
                      <h2 className='text-lg font-bold tracking-tight'>
                          Paiement BBVA
                      </h2>
                      <p>Virement</p>
                    </div>
                    <div className="mt-6 flex justify-end space-x-3">
                        <button
                          type="button"
                          onClick={() => setStep(2)}
                          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                        >
                          Back
                        </button>
                        <button
                          type="submit"
                          disabled={isProcessing}
                          className="px-4 py-2 text-sm font-medium text-white bg-lime-500 rounded-md hover:bg-lime-600 disabled:opacity-50"
                        >
                          Pay Now
                        </button>                   
                  </div>
                    </>
          )}
        </form>
      </div>
    </div>
  );
} 
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import MondialRelayWidget from '../mondial-relay/RelayWidget';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface CartCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: { name: string; email: string; shipping_address: string }) => Promise<void>;
  isProcessing: boolean;
  total: number;
}

export default function CartCheckoutModal({
  isOpen,
  onClose,
  onSubmit,
  isProcessing,
  total,
}: CartCheckoutModalProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    shipping_address: '',
  });

  useEffect(() => {
    // Listen for changes to the Mondial Relay widget
    const checkMondialRelaySelection = setInterval(() => {
      const targetInput = document.getElementById('Target_Widget') as HTMLInputElement;
      if (targetInput && targetInput.value) {
        setFormData(prev => ({ ...prev, shipping_address: targetInput.value }));
      }
    }, 1000);

    return () => clearInterval(checkMondialRelaySelection);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      // Validate all required fields
      if (!formData.name || !formData.email || !formData.shipping_address) {
        alert('Please fill in all required fields and select a Mondial Relay point');
        return;
      }
      setStep(2);
    } else {
      await onSubmit(formData);
    }
  };

  const handlePayment = async () => {
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          shipping_address: formData.shipping_address,
        }),
      });

      const { sessionId } = await response.json();
      const stripe = await stripePromise;
      if (stripe) {
        const { error } = await stripe.redirectToCheckout({ sessionId });
        if (error) {
          console.error('Error:', error);
        }
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
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
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className={`text-sm ${step >= 1 ? 'text-blue-600' : 'text-gray-500'}`}>
              Personal Info
            </span>
            <span className={`text-sm ${step >= 2 ? 'text-blue-600' : 'text-gray-500'}`}>
              Payment
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 2) * 100}%` }}
            />
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {step === 1 ? (
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
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
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select a Mondial Relay Point *
                </label>
                <div className="border rounded-md p-2">
                  <MondialRelayWidget />
                </div>
                {formData.shipping_address && (
                  <p className="mt-2 text-sm text-gray-600">
                    Selected point: {formData.shipping_address}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-2">Order Summary</h3>
                <div className="flex justify-between mb-2">
                  <span>Total Amount:</span>
                  <span className="font-medium">${total.toFixed(2)}</span>
                </div>
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm text-gray-600">
                    <strong>Shipping Address:</strong> {formData.shipping_address}
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                You will be redirected to Stripe to complete your payment securely.
              </p>
            </div>
          )}

          <div className="mt-6 flex justify-end space-x-3">
            {step === 2 && (
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Back
              </button>
            )}
            <button
              type="submit"
              disabled={isProcessing}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isProcessing ? 'Processing...' : step === 1 ? 'Continue to Payment' : 'Pay Now'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 
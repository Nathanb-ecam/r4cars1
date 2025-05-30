import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import dynamic from 'next/dynamic';

// Dynamically import the Map component to avoid SSR issues
const Map = dynamic(() => import('./Map'), {
  ssr: false,
  loading: () => (
    <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
    </div>
  ),
});

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: (formData: {
    name: string;
    email: string;
    shippingAddress: string;
  }) => void;
  isProcessing: boolean;
}

export default function CheckoutModal({
  isOpen,
  onClose,
  onCheckout,
  isProcessing,
}: CheckoutModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    shippingAddress: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLocationSelect = (address: string) => {
    setFormData((prev) => ({
      ...prev,
      shippingAddress: address,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep === 1) {
      setCurrentStep(2);
    } else {
      onCheckout(formData);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Checkout</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentStep >= 1
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  1
                </div>
                <span className="ml-2 text-sm font-medium">Shipping</span>
              </div>
              <div className="flex-1 h-1 mx-4 bg-gray-200">
                <div
                  className="h-full bg-indigo-600 transition-all duration-300"
                  style={{ width: currentStep === 2 ? '100%' : '0%' }}
                ></div>
              </div>
              <div className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentStep === 2
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  2
                </div>
                <span className="ml-2 text-sm font-medium">Payment</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {currentStep === 1 ? (
              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="shippingAddress"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Select Mondial Relay Point
                  </label>
                  <Map onLocationSelect={handleLocationSelect} />
                  {formData.shippingAddress && (
                    <p className="mt-2 text-sm text-gray-600">
                      Selected: {formData.shippingAddress}
                    </p>
                  )}
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!formData.name || !formData.email || !formData.shippingAddress}
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continue to Payment
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Order Summary</h3>
                  <div className="space-y-2">
                    <p>
                      <span className="text-gray-600">Name:</span> {formData.name}
                    </p>
                    <p>
                      <span className="text-gray-600">Email:</span> {formData.email}
                    </p>
                    <p>
                      <span className="text-gray-600">Shipping Address:</span>{' '}
                      {formData.shippingAddress}
                    </p>
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? 'Processing...' : 'Complete Payment'}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
} 
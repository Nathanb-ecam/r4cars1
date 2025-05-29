import { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { processPayment } from '@/utils/payment';

interface CheckoutFormProps {
  amount: number;
  orderId: string;
  doctorId: string;
  onSuccess: (orderId: string) => void;
  onError: (error: string) => void;
  bypassPayment?: boolean;
}

export default function CheckoutForm({
  amount,
  orderId,
  doctorId,
  onSuccess,
  onError,
  bypassPayment = false
}: CheckoutFormProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsProcessing(true);

    try {
      const result = await processPayment({
        amount,
        orderId,
        doctorId,
        bypassPayment
      });

      if (result.success) {
        onSuccess(result.orderId);
      } else {
        onError(result.error || 'Payment failed');
      }
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Payment failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {!bypassPayment && (
        <div className="p-4 border rounded-md">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }}
          />
        </div>
      )}

      <button
        type="submit"
        disabled={isProcessing || (!bypassPayment && !stripe)}
        className="w-full px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isProcessing ? 'Processing...' : bypassPayment ? 'Confirm Order' : 'Pay Now'}
      </button>
    </form>
  );
} 
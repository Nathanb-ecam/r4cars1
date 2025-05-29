import { loadStripe } from '@stripe/stripe-js';
import { trackOrderConversion } from './affiliate';

interface PaymentData {
  amount: number;
  orderId: string;
  doctorId: string;
  bypassPayment?: boolean;
}

export const processPayment = async (data: PaymentData) => {
  try {
    if (data.bypassPayment) {
      // If payment is bypassed, directly create the order
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          doctorId: data.doctorId,
          amount: data.amount,
          status: 'completed'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      const order = await response.json();

      // Track the conversion with GoAffPro
      trackOrderConversion({
        number: order._id,
        total: data.amount
      });

      return { success: true, orderId: order._id };
    } else {
      // Create Stripe payment intent
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: data.amount,
          orderId: data.orderId,
          doctorId: data.doctorId
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create payment intent');
      }

      const { clientSecret } = await response.json();

      // Initialize Stripe payment
      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
      if (!stripe) {
        throw new Error('Stripe failed to initialize');
      }

      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret);

      if (stripeError) {
        throw new Error(stripeError.message);
      }

      if (paymentIntent.status === 'succeeded') {
        // Track the conversion with GoAffPro
        trackOrderConversion({
          number: data.orderId,
          total: data.amount
        });

        return { success: true, orderId: data.orderId };
      }

      return { success: false, error: 'Payment failed' };
    }
  } catch (error) {
    console.error('Payment processing error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Payment failed' };
  }
}; 
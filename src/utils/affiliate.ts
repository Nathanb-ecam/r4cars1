import { CustomerPersonalInfo } from "@/app/visitor/cart/page";
import { ExtendedOrderGoAffPro, ExtendSchemaGoAffPro } from "@/models/GoAffPro";


export const trackAffiliateSale = async (data: ExtendSchemaGoAffPro) => {
  try {
    // Here you would integrate with GoAffPro's API
    // For now, we'll just log the data
    console.log('Tracking affiliate sale:', {
      ...data,
      platform: 'GoAffPro',
      timestamp: new Date().toISOString(),
    });


    const response = await fetch('/api/admin/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error('Failed to save affiliate order');

    // Example of how you might integrate with GoAffPro:
    // await fetch('https://api.goaffpro.com/v1/sales', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${process.env.GOAFFPRO_API_KEY}`,
    //   },
    //   body: JSON.stringify({
    //     affiliate_id: data.doctorNumber,
    //     order_id: data.orderId,
    //     amount: data.total,
    //     currency: 'USD',
    //   }),
    // });
  } catch (error) {
    console.error('Error tracking affiliate sale:', error);
  }
};

interface OrderData {
  number: string;
  total: number;
}

export const trackOrderConversion = (orderData: OrderData) => {
  if (typeof window !== 'undefined') {
    window.goaffpro_order = {
      number: orderData.number,
      total: orderData.total
    };
    
    if (typeof window.goaffproTrackConversion !== 'undefined') {
      window.goaffproTrackConversion(window.goaffpro_order);
    }
  }
}; 
import { ExtendSchemaGoAffPro } from "@/models/GoAffPro";



export const postAffiliateSale = async (data: ExtendSchemaGoAffPro) => {
  try {
    // Here you would integrate with GoAffPro's API
    // For now, we'll just log the data
    console.log('Tracking affiliate sale:', {
      ...data,
      platform: 'GoAffPro',
      timestamp: new Date().toISOString(),
    });


    const response = await fetch('/api/visitor/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error('Failed to save affiliate order');
    return true;
    
  } catch (error) {
    console.error('Error tracking affiliate sale:', error);
    return false;
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
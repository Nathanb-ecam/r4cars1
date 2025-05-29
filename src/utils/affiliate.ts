interface AffiliateData {
  doctorNumber: string;
  orderId: string;
  total: number;
}

export const trackAffiliateSale = async (data: AffiliateData) => {
  try {
    // Here you would integrate with GoAffPro's API
    // For now, we'll just log the data
    console.log('Tracking affiliate sale:', {
      ...data,
      platform: 'GoAffPro',
      timestamp: new Date().toISOString(),
    });

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
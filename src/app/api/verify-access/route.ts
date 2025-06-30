import { env } from "@/config/env";

export const runtime = 'nodejs';

export async function GET() {
  const url =   `${env.goaffpro.apiUrl}/admin/affiliates`
  // const url =   `${env.goaffpro.apiUrl}/sdk/affiliate`
  const params = new URLSearchParams({
    // ref_code: "YOUR_REFERRAL_CODE",        // or use `coupon` instead
    fields: "id,name,email,ref_codes, coupons" // comma-separated fields
  });
  console.log(url)

  const response = await fetch(`${url}?${params.toString()}`, {
        method: 'GET', // Optional, since GET is default
        headers: {          
          'x-goaffpro-access-token':`${env.goaffpro.accessToken}`,          
          // 'x-goaffpro-public-token':`${env.goaffpro.publicToken}`,          
          'Content-Type': 'application/json', // Often a good idea to include
        },
      });
      
      const data = await response.json();
      console.log("RESPONSE")
      console.log(JSON.stringify(data))
      return data;
  }
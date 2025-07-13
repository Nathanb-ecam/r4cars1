import { env } from "@/config/env";
import { NextResponse } from "next/server";

export const runtime = 'nodejs';

export async function GET() {
  const url =   `${env.goaffpro.apiUrl}/admin/affiliates`
  // const url =   `${env.goaffpro.apiUrl}/sdk/affiliate`
  const params = new URLSearchParams({
    // ref_code: "YOUR_REFERRAL_CODE",        // or use `coupon` instead
    // fields: "id,name,email,ref_codes,tags,coupons" // comma-separated fields
    fields: "id,name,email,ref_codes" // comma-separated fields
  });
  // console.log(url)

  const response = await fetch(`${url}?${params.toString()}`, {
        method: 'GET', // Optional, since GET is default
        headers: {          
          'x-goaffpro-access-token':`${env.goaffpro.accessToken}`,          
          // 'x-goaffpro-public-token':`${env.goaffpro.publicToken}`,          
          'Content-Type': 'application/json', // Often a good idea to include
    },
  });
      
  const {affiliates, _} = await response.json();
  // console.log("__________________AFFILIATES__________________")
  // console.log(JSON.stringify(affiliates))  
  return NextResponse.json(affiliates, { status: 201 });
  }


  export async function POST(request : Request) {
    try{
        const {tag,...data} = await request.json();
    
        const response = await fetch(`${env.goaffpro.apiUrl}/admin/affiliates`, {
          method: 'POST', // Optional, since GET is default
          headers: {          
            'x-goaffpro-access-token':`${env.goaffpro.accessToken}`,          
            // 'x-goaffpro-public-token':`${env.goaffpro.publicToken}`,          
            'Content-Type': 'application/json', // Often a good idea to include
          },
          body:JSON.stringify(data)
        });

        const {affiliate_id} = await response.json();
   

        const res = await fetch(`${env.goaffpro.apiUrl}/admin/affiliates/${affiliate_id}/tags`, {
          method: 'PUT', // Optional, since GET is default
          headers: {          
            'x-goaffpro-access-token':`${env.goaffpro.accessToken}`,          
            // 'x-goaffpro-public-token':`${env.goaffpro.publicToken}`,          
            'Content-Type': 'application/json', // Often a good idea to include
          },
          body:JSON.stringify({tags:[tag]})
        });

        await res.json();

        return NextResponse.json(res, { status: 201 });
    }
    catch (error){
      console.error('Error creating order:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la création de la commande' },
        { status: 500 }
      );
    }
  }



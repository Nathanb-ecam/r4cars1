import { env } from "@/config/env";
import { ExtendSchemaGoAffPro } from "@/models/GoAffPro";
import { NextResponse } from "next/server";

export const runtime = 'nodejs';

export async function POST(request : Request) {
    try{  
        const order:ExtendSchemaGoAffPro = await request.json();
 
        const response = await fetch(`${env.goaffpro.apiUrl}/admin/orders`, {
          method: 'POST',
          headers: {          
            'x-goaffpro-access-token':`${env.goaffpro.accessToken}`,                      
            'Content-Type': 'application/json', 
          },
          // body:JSON.stringify({order:goaffOrder, affiliate_id:affiliate_id})
          body:JSON.stringify(order)
        });

        console.log("__________________POST_GOAFFPRO_ORDER__________________")
        console.log(order)
        
        await response.json();
        return NextResponse.json({ status: 201 });
    }
    catch (error){
      console.error('Error creating order:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la création de la commande' },
        { status: 500 }
      );
    }
  }
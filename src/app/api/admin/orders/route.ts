import { NextResponse } from 'next/server';
import { env } from '@/config/env';



export async function GET() {
    const url =   `${env.goaffpro.apiUrl}/admin/orders`
    const params = new URLSearchParams({
      // created_at_max, created_at_min
      fields: "id,affiliate_id,status,total,subtotal,shipping_address,customer_email,number,line_items,commission" // comma-separated fields
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
      
    const {orders, _} = await response.json();
    console.log("RESPONSE")
    console.log(JSON.stringify(orders))  
    return NextResponse.json(orders, { status: 201 });
  }

  

  export async function POST(request : Request) {
    try{
        const {tag,...data} = await request.json();
    
        const response = await fetch(`${env.goaffpro.apiUrl}/admin/orders`, {
          method: 'POST',
          headers: {          
            'x-goaffpro-access-token':`${env.goaffpro.accessToken}`,                      
            'Content-Type': 'application/json', 
          },
          body:JSON.stringify(data)
        });


        return NextResponse.json(response, { status: 201 });
    }
    catch (error){
      console.error('Error creating order:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la création de la commande' },
        { status: 500 }
      );
    }
  }



// INTERNAL SYSTEM ORDERS 
// export async function GET() {
//   try {
//     await connectDB();
//     const orders = await OrderModel.find({})
//       .sort({ createdAt: -1 });
    
//     return NextResponse.json(orders);
//   } catch (error) {
//     console.error('Error fetching orders:', error);
//     return NextResponse.json(
//       { error: 'Erreur lors de la récupération des commandes' },
//       { status: 500 }
//     );
//   }
// }

// export async function POST(request: Request) {
//   try {
//     const data = await request.json();
//     await connectDB();
    
//     const order = await OrderModel.create({
//       ...data,
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     });

//     return NextResponse.json(order, { status: 201 });
//   } catch (error) {
//     console.error('Error creating order:', error);
//     return NextResponse.json(
//       { error: 'Erreur lors de la création de la commande' },
//       { status: 500 }
//     );
//   }
// } 
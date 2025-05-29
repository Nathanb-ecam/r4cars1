import { NextResponse } from 'next/server';
import { env } from '@/config/env';



export async function GET() {
    const url =   `${env.goaffpro.apiUrl}/admin/orders`
    const params = new URLSearchParams({
      // created_at_max, created_at_min
      fields: "id,affiliate_id,status,total,subtotal,shipping_address,customer_email,number,line_items,commission" // comma-separated fields
    });
    console.log("GET URL" + url)

    const response = await fetch(`${url}?${params.toString()}`, {
          method: 'GET', // Optional, since GET is default
          headers: {          
            'x-goaffpro-access-token':`${env.goaffpro.accessToken}`,          
            // 'x-goaffpro-public-token':`${env.goaffpro.publicToken}`,          
            'Content-Type': 'application/json', // Often a good idea to include
      },
    });
      
    console.log(response)
    const {orders} = await response.json();
    console.log("GET RESPONSE")
    console.log(JSON.stringify(orders))  
    return NextResponse.json(orders, { status: 201 });
  }

  

  // first need to create an internal order then use its id and orderNumber to call this function
  export async function POST(request : Request) {
    try{
        const number = 1 // should be obtained by the db
        const id = "1238" // should be pulled from the db, should be different (incremented)
        const {affiliate_id, ...order} = await request.json();        
        const goaffOrder = {...order,id, number,forceSdk: true}
 
        const response = await fetch(`${env.goaffpro.apiUrl}/admin/orders`, {
          method: 'POST',
          headers: {          
            'x-goaffpro-access-token':`${env.goaffpro.accessToken}`,                      
            'Content-Type': 'application/json', 
          },
          body:JSON.stringify({order:goaffOrder, affiliate_id:affiliate_id})
        });

        console.log("__________________GOAFFPRO__________________")
        console.log({affiliate_id,goaffOrder})
        
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
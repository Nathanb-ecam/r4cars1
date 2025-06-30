import { NextResponse } from 'next/server';
import { OrderModel } from '@/models/Order';
import connectDB from '@/lib/mongodb';
import { env } from '@/config/env';

export const runtime = 'nodejs';

export async function DELETE(
  request: Request, 
{ params }: { params: Promise<{ id: string }> }  
) {
    
  const {id} = await params;

  console.log("__________DELETE_ORDER__________")
  console.log(id)
  const res = await fetch(`${env.goaffpro.apiUrl}/admin/orders/${id}`, {
    method: "DELETE",
    headers: {
      "x-goaffpro-access-token": env.goaffpro.accessToken,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    return NextResponse.json({ error: errorText }, { status: res.status });
  }
  
  return NextResponse.json({ message: "Affiliate deleted successfully" }, { status: 200 });
}




// export async function PUT(
  //   request: Request,
  //   { params }: { params: { id: string } }
  // ) {
  //   try {
  //     const { id } = params;
  //     const data = await request.json();
  //     await connectDB();
  
  //     const order = await OrderModel.findByIdAndUpdate(
  //       id,
  //       {
  //         ...data,
  //         updatedAt: new Date(),
  //       },
  //       { new: true }
  //     );
  
  //     if (!order) {
  //       return NextResponse.json(
  //         { error: 'Commande non trouvée' },
  //         { status: 404 }
  //       );
  //     }
  
  //     return NextResponse.json(order);
  //   } catch (error) {
  //     console.error('Error updating order:', error);
  //     return NextResponse.json(
  //       { error: 'Erreur lors de la mise à jour de la commande' },
  //       { status: 500 }
  //     );
  //   }
  // }
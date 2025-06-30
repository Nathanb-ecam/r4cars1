// import { NextResponse } from 'next/server';
// import { ProductModel } from '@/models/Product';
// import connectDB from '@/lib/mongodb';

// export async function GET() {
//   try {
//     await connectDB();
//     const stock = await StockModel.find({})
//       .populate('productId', 'name description price image')
//       .sort({ updatedAt: -1 });
    
//     return NextResponse.json(stock);
//   } catch (error) {
//     console.error('Error fetching stock:', error);
//     return NextResponse.json(
//       { error: 'Erreur lors de la récupération du stock' },
//       { status: 500 }
//     );
//   }
// }

// export async function POST(request: Request) {
//   try {
//     const data = await request.json();
//     await connectDB();

//     // Check if product exists
//     const product = await ProductModel.findById(data.productId);
//     if (!product) {
//       return NextResponse.json(
//         { error: 'Produit non trouvé' },
//         { status: 404 }
//       );
//     }

//     // Check if stock entry already exists
//     let stock = await StockModel.findOne({ productId: data.productId });

//     if (stock) {
//       // Update existing stock
//       stock = await StockModel.findByIdAndUpdate(
//         stock._id,
//         {
//           quantity: data.quantity,
//           lastUpdated: new Date(),
//           updatedAt: new Date(),
//         },
//         { new: true }
//       );
//     } else {
//       // Create new stock entry
//       stock = await StockModel.create({
//         productId: data.productId,
//         quantity: data.quantity,
//         lastUpdated: new Date(),
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       });
//     }

//     return NextResponse.json(stock, { status: 201 });
//   } catch (error) {
//     console.error('Error updating stock:', error);
//     return NextResponse.json(
//       { error: 'Erreur lors de la mise à jour du stock' },
//       { status: 500 }
//     );
//   }
// } 
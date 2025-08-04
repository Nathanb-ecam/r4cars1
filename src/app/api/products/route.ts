// import { NextResponse } from 'next/server';
// import { ProductModel } from '@/models/Product';
// import connectDB from '@/lib/mongodb';

// export const runtime = 'nodejs';

// export async function GET() {
//   try {
//     await connectDB();
//     const products = await ProductModel.find({}).sort({ createdAt: -1 });
//     return NextResponse.json(products);
//   } catch (error) {
//     console.error('Error fetching products:', error);
//     return NextResponse.json(
//       { error: 'Erreur lors de la récupération des produits' },
//       { status: 500 }
//     );
//   }
// }



// app/api/products/route.ts
import { NextRequest, NextResponse } from 'next/server';
import  connectDB  from '@/lib/mongodb'; // ton connecteur vers MongoDB
import {ProductModel} from '@/models/Product';

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '6');
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      ProductModel.find({ visibleOnWebsite: true })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      ProductModel.countDocuments({ visibleOnWebsite: true }),
    ]);

    return NextResponse.json({ products, total });
  } catch (error) {
    console.error('Error fetching paginated products:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des produits' },
      { status: 500 }
    );
  }
}



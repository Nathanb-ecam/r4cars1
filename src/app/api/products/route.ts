import { NextResponse } from 'next/server';
import { ProductModel } from '@/models/Product';
import connectDB from '@/lib/mongodb';

export const runtime = 'nodejs';

export async function GET() {
  try {
    await connectDB();
    const products = await ProductModel.find({}).sort({ createdAt: -1 });
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des produits' },
      { status: 500 }
    );
  }
}


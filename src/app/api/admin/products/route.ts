import { NextResponse } from 'next/server';
import { ProductModel } from '@/models/Product';
import connectDB from '@/lib/mongodb';
import { env } from '@/config/env';

export const runtime = 'nodejs';

export async function GET() {
  try {    
    await connectDB();
    const products = await ProductModel.find({}).sort({ createdAt: -1 });
    // console.log(products)
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des produits' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const {_id,...data} = await request.json();
    await connectDB();
    
    const product = await ProductModel.create({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du produit' },
      { status: 500 }
    );
  }
} 


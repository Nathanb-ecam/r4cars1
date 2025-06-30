import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { ProductModel } from '@/models/Product';

export const runtime = 'nodejs';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();

    const stock = await ProductModel.findById(id)
      .populate('productId', 'name description price image');

    if (!stock) {
      return NextResponse.json(
        { error: 'Stock non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json(stock);
  } catch (error) {
    console.error('Error fetching stock item:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du stock' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();
    await connectDB();

    const stock = await ProductModel.findByIdAndUpdate(
      id,
      {
        stock: data.quantity,
        lastUpdated: new Date(),
        updatedAt: new Date(),
      },
      { new: true }
    ).populate('productId', 'name description price image');

    if (!stock) {
      return NextResponse.json(
        { error: 'Stock non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json(stock);
  } catch (error) {
    console.error('Error updating stock item:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du stock' },
      { status: 500 }
    );
  }
}


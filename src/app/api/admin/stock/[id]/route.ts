import { NextResponse } from 'next/server';
import { StockModel } from '@/models/Stock';
import connectDB from '@/lib/mongodb';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await connectDB();

    const stock = await StockModel.findById(id)
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
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const data = await request.json();
    await connectDB();

    const stock = await StockModel.findByIdAndUpdate(
      id,
      {
        quantity: data.quantity,
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

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await connectDB();

    const stock = await StockModel.findByIdAndDelete(id);

    if (!stock) {
      return NextResponse.json(
        { error: 'Stock non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Stock supprimé avec succès' });
  } catch (error) {
    console.error('Error deleting stock item:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du stock' },
      { status: 500 }
    );
  }
} 
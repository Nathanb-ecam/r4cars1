import { NextResponse } from 'next/server';
import { ProductModel } from '@/models/Product';
import connectDB from '@/lib/mongodb';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const body = await request.json();

    // Validate required fields
    if (!body.name || !body.description || !body.originalPrice || !body.discountedPrice) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Find and update the product
    const updatedProduct = await ProductModel.findByIdAndUpdate(
      params.id,
      {
        $set: {
          name: body.name,
          description: body.description,
          originalPrice: body.originalPrice,
          discountedPrice: body.discountedPrice,
          imageUrl: body.imageUrl,
          stock: body.stock,
          updatedAt: new Date()
        }
      },
      { new: true }
    );

    if (!updatedProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const deletedProduct = await ProductModel.findByIdAndDelete(params.id);

    if (!deletedProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 
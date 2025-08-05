import { NextResponse } from 'next/server';
import { allowedFields, ProductModel } from '@/models/Product';
import connectDB from '@/lib/mongodb';

export const runtime = 'nodejs';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const {id} = await params
    console.log("Updating product with ID:", id);
    await connectDB();
    const body = await request.json();
    console.log("Request body:", body);


    const hasAtLeastOneField = allowedFields.some((field) => field in body);

      if (!hasAtLeastOneField) {
        return NextResponse.json(
          { error: 'At least one field must be provided for update.' },
          { status: 400 }
        );
      }


    console.log("NOT YET")
    // Find and update the product
    const updatedProduct = await ProductModel.findByIdAndUpdate(
      id,
      {
        $set: {
          name: body.name,
          fullName: body.fullName,
          description: body.description,
          price: body.price,
          kms: body.kms,
          benzineType: body.benzineType,
          year: body.year,
          transmission: body.transmission,
          doors: body.doors,
          motorisation: body.motorisation,
          sections: body.sections,
          imageUrl: body.imageUrl,
          hp: body.hp,
          visibleOnWebsite: body.visibleOnWebsite,          
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const {id} = await params
    const deletedProduct = await ProductModel.findByIdAndDelete(id);

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
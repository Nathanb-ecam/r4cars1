import { NextRequest, NextResponse } from "next/server";
import  connectDB  from '@/lib/mongodb';
import {ProductModel} from "@/models/Product";

export async function GET(    
    req: NextRequest,
    {params} : { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const {id} = await params;     

    if (!id) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    const product = await ProductModel.findById(id);

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération du produit" },
      { status: 500 }
    );
  }
}

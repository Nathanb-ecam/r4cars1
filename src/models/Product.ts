import mongoose from 'mongoose';

export interface Product {
  _id: string;
  name: string;
  sku: string;
  description: string;
  originalPrice: number;
  discountedPrice: number;
  imageUrl: string;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new mongoose.Schema<Product>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  originalPrice: { type: Number, required: true },
  discountedPrice: { type: Number, required: true },
  imageUrl: { type: String, required: true },
  stock: { type: Number, required: false, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const ProductModel = mongoose.models?.Product || mongoose.model<Product>('Product', productSchema); 
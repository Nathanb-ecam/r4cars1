import mongoose from 'mongoose';

interface Sections{
  title:string;
  desc:string;
  blocks:Array<string>;
}
export interface Product {
  _id: string;
  name: string;
  sku: string;
  description: string;
  originalPrice: number;
  discountedPrice: number;
  imageUrl: string;
  imageSelfHosted:boolean;
  stock: number;
  isSpecialOffer:boolean;
  visibleOnWebsite:boolean;
  components:Array<string>;
  conditionning:string;
  sections:Array<Sections>;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new mongoose.Schema<Product>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  sku: { type: String, required: true },
  originalPrice: { type: Number, required: true },
  discountedPrice: { type: Number, required: true },
  imageUrl: { type: String, required: true },
  imageSelfHosted: { type: Boolean, required: true, default: true },
  stock: { type: Number, required: false, default: 0 },
  isSpecialOffer: { type: Boolean, required: false, default: false },
  visibleOnWebsite: { type: Boolean, required: false, default: false },
  conditionning: { type: String, required: false, default: "" },
  components: { type: Array },
  sections: { type: Array },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const ProductModel = mongoose.models?.Product || mongoose.model<Product>('Product', productSchema); 
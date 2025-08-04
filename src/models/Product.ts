import mongoose from 'mongoose';

interface Sections{
  title:string;
  desc:string;
  blocks:Array<string>;
}
export interface Product {
  _id: string;
  name: string;
  fullName: string;
  sku: string;
  originalPrice:string;
  discountedPrice:string;
  description: string;

  transmission: string;
  kms: string;  
  year: string;  
  benzineType: string;  
  hp: string;
  doors:string;
  motorisation: string;
  
  imageUrl: string;
  imageSelfHosted:boolean;  
  isSpecialOffer:boolean;
  visibleOnWebsite:boolean;
    
  sections:Array<Sections>;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new mongoose.Schema<Product>({
  name: { type: String, required: true },
  fullName: { type: String, required: true },
  description: { type: String, required: true },
  sku: { type: String, required: true },
  originalPrice: { type: String, required: true },
  discountedPrice: { type: String, required: true },
  
    
  transmission: { type: String, required: true },
  year: { type: String, required: true },
  benzineType: { type: String, required: true },
  hp: { type: String, required: true },
  doors: { type: String, required: true },
  kms: { type: String, required: true },
  
  imageUrl: { type: String, required: true },
  imageSelfHosted: { type: Boolean, required: true, default: true },  
  isSpecialOffer: { type: Boolean, required: false, default: false },
  visibleOnWebsite: { type: Boolean, required: false, default: false },
  
  
  sections: 
  {
    type: [
    {
      title: { type: String, required: true },
      desc: { type: String, required: true },
      blocks: { type: [String], required: true },
    }
  ]
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const ProductModel = mongoose.models?.Product || mongoose.model<Product>('Product', productSchema); 
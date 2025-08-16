import mongoose from 'mongoose';

export interface Sections{
  title:string;
  desc:string;
  blocks:Array<string>;
}

export const allowedFields = [
    'name', 'fullName', 'description', 'price', 'kms', 'benzineType',
    'year', 'transmission', 'doors', 'motorisation', 'sections',
    'imageUrl', 'hp', 'visibleOnWebsite'
];
export interface Product {
  _id: string;
  name: string;
  fullName: string;  
  price:string;  
  description: string;

  transmission: string;
  kms: string;  
  year: string;  
  benzineType: string;  
  hp: string;
  doors:string;
  motorisation: string;
  
  imageUrl: string;  
  visibleOnWebsite:boolean;
    
  sections:Array<Sections>;
  createdAt: Date;
  updatedAt: Date;
}


const productSchema = new mongoose.Schema<Product>({
  name: { type: String, required: true },
  fullName: { type: String, required: true },
  description: { type: String, required: true },  
  price: { type: String, required: true },  
  
    
  transmission: { type: String, required: true },
  year: { type: String, required: true },
  benzineType: { type: String, required: true },
  hp: { type: String, required: true },
  doors: { type: String, required: true },
  kms: { type: String, required: true },
  
  imageUrl: { type: String, required: true },  
  visibleOnWebsite: { type: Boolean, required: false, default: false },
  
  
  sections: 
  {
    type: [
    {
      title: { type: String, required: true },
      desc: { type: String, required: false },
      blocks: { type: [String], required: true },
    }
  ]
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const ProductModel = mongoose.models?.Product || mongoose.model<Product>('Product', productSchema); 
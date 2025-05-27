import mongoose from 'mongoose';
import { Product } from './Product';

export interface Stock {
  id: string;
  productId: string;
  quantity: number;
  lastUpdated: Date;
  createdAt: Date;
  updatedAt: Date;
}

const stockSchema = new mongoose.Schema<Stock>({
  productId: { type: String, required: true, ref: 'Product' },
  quantity: { type: Number, required: true, default: 0 },
  lastUpdated: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const StockModel = mongoose.models?.Stock || mongoose.model<Stock>('Stock', stockSchema); 
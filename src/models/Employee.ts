import mongoose from 'mongoose';

export interface Employee {
  _id: string;
  
  fullName: string;  
  role:string;  
  description: string;
  imageUrl : string;

  visibleOnWebsite: boolean;

  createdAt: Date;
  updatedAt: Date;
}


const employeeSchema = new mongoose.Schema<Employee>({
  
  fullName: { type: String, required: true },
  description: { type: String, required: true },            
  role: { type: String, required: true },            
  imageUrl: { type: String, required: false },  
  visibleOnWebsite: { type: Boolean, required: false, default: false },  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const EmployeeModel = mongoose.models?.Employee || mongoose.model<Employee>('Employee', employeeSchema); 
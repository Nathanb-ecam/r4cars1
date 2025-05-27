import mongoose from 'mongoose';

export interface IDoctor {
  name: string;
  email: string;
  doctorNumber: string;
  accessCode: string;
}

const doctorSchema = new mongoose.Schema<IDoctor>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  doctorNumber: { type: String, required: true, unique: true },
  accessCode: { type: String, required: true },
});

export const DoctorModel = mongoose.models?.Doctor || mongoose.model<IDoctor>('Doctor', doctorSchema); 
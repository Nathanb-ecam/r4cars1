
import connectDB from '../lib/mongodb';

import { DoctorModel } from '../models/Doctor';

async function createDoctor() {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    const doctorEmail = 'doctor@labeuromed.com';

    // Check if doctor user already exists
    const existingdoctor = await DoctorModel.findOne({ email: doctorEmail });
    if (existingdoctor) {
      console.log('doctor user already exists');
      process.exit(0);
    }

    // Create doctor    
    const doctor = await DoctorModel.create({
      name: "Doctor drake",
      email: doctorEmail,
      doctorNumber:"1234567890",
      accessCode: "355637"
    });

    console.log('doctor user created successfully:', {
      email: doctor.email,
      doctorNumber: doctor.doctorNumber,
      accessCode: doctor.accessCode      
    });

    process.exit(0);
  } catch (error) {
    console.error('Error creating doctor user:', error);
    process.exit(1);
  }
}

createDoctor(); 
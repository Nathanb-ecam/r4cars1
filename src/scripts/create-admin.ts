import { User, UserModel, UserRole } from '../models/User';
import connectDB from '../lib/mongodb';
import bcrypt from 'bcryptjs';

async function createAdminUser() {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    const adminEmail = 'admin@labeuromed.com';
    const adminPassword = 'admin123'; // Change this to a secure password

    // Check if admin user already exists
    const existingAdmin = await UserModel.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    // Create admin user
    const passwordHash = await bcrypt.hash(adminPassword, 10);
    const admin = await UserModel.create({
      email: adminEmail,
      passwordHash,
      role: UserRole.ADMIN,
    });

    console.log('Admin user created successfully:', {
      email: admin.email,
      role: admin.role,
    });

    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
}

createAdminUser(); 
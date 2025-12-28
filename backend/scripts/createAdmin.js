import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const createAdmin = async () => {
    try {
        // Connect to database
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to database');

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: 'admin@platform.com' });
        if (existingAdmin) {
            console.log('⚠️  Admin user already exists!');
            console.log('Deleting existing admin to recreate with correct password...');
            await User.deleteOne({ email: 'admin@platform.com' });
            console.log('✅ Old admin deleted');
        }

        // Create admin user (password will be hashed by the User model's pre-save hook)
        const admin = await User.create({
            name: 'Admin',
            email: 'admin@platform.com',
            password: 'Admin@12345',
            role: 'admin',
            isEmailVerified: true,
            rating: 5,
            reviewCount: 0
        });

        console.log('\n🎉 Admin user created successfully!\n');
        console.log('═'.repeat(50));
        console.log('📧 Email:    admin@platform.com');
        console.log('🔑 Password: Admin@12345');
        console.log('═'.repeat(50));
        console.log('\n⚠️  IMPORTANT: Change this password after first login!\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating admin:', error);
        process.exit(1);
    }
};

createAdmin();

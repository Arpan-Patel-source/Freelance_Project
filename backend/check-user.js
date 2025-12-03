// Quick script to check if user exists in database
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const checkUserExists = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));

        const email = 'testotpflow@gmail.com';
        const user = await User.findOne({ email });

        if (user) {
            console.log('❌ FAIL: User exists in database BEFORE OTP verification!');
            console.log('User data:', {
                _id: user._id,
                name: user.name,
                email: user.email,
                isEmailVerified: user.isEmailVerified
            });
        } else {
            console.log('✅ PASS: User does NOT exist in database (correct behavior)');
            console.log('User will be created only after OTP verification.');
        }

        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
};

checkUserExists();

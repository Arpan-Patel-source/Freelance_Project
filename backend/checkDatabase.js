import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Job from './models/Job.js';
import Contract from './models/Contract.js';
import Proposal from './models/Proposal.js';

dotenv.config();

const checkDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB\n');

        const userCount = await User.countDocuments();
        const adminCount = await User.countDocuments({ role: 'admin' });
        const clientCount = await User.countDocuments({ role: 'client' });
        const freelancerCount = await User.countDocuments({ role: 'freelancer' });
        const jobCount = await Job.countDocuments();
        const contractCount = await Contract.countDocuments();
        const proposalCount = await Proposal.countDocuments();

        console.log('📊 Database Statistics:');
        console.log('─────────────────────────────');
        console.log(`Total Users: ${userCount}`);
        console.log(`  - Admins: ${adminCount}`);
        console.log(`  - Clients: ${clientCount}`);
        console.log(`  - Freelancers: ${freelancerCount}`);
        console.log(`Total Jobs: ${jobCount}`);
        console.log(`Total Contracts: ${contractCount}`);
        console.log(`Total Proposals: ${proposalCount}\n`);

        if (userCount === 0) {
            console.log('⚠️  WARNING: Database is empty!');
            console.log('Run: node scripts/createAdmin.js');
            console.log('Then: node scripts/seedData.js\n');
        }

        // Check admin user
        const admin = await User.findOne({ role: 'admin' });
        if (admin) {
            console.log('✅ Admin user exists:');
            console.log(`   Email: ${admin.email}`);
            console.log(`   Name: ${admin.name}\n`);
        } else {
            console.log('❌ No admin user found!\n');
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

checkDatabase();

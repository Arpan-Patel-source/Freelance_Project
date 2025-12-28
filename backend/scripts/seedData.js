import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Job from '../models/Job.js';
import Contract from '../models/Contract.js';
import Proposal from '../models/Proposal.js';

dotenv.config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to database');

        // Count existing data
        const userCount = await User.countDocuments({ role: { $ne: 'admin' } });
        const jobCount = await Job.countDocuments();
        const contractCount = await Contract.countDocuments();

        console.log('\n📊 Current Data:');
        console.log(`Users (non-admin): ${userCount}`);
        console.log(`Jobs: ${jobCount}`);
        console.log(`Contracts: ${contractCount}`);

        if (userCount > 0 || jobCount > 0 || contractCount > 0) {
            console.log('\n✅ Database already has data. No need to seed.');
            process.exit(0);
        }

        console.log('\n🌱 Seeding sample data...\n');

        // Create sample freelancers
        const freelancers = await User.create([
            {
                name: 'John Developer',
                email: 'john@example.com',
                password: 'password123',
                role: 'freelancer',
                isEmailVerified: true,
                bio: 'Full-stack developer with 5+ years experience',
                skills: ['React', 'Node.js', 'MongoDB', 'Python'],
                hourlyRate: 50,
                rating: 4.8,
                reviewCount: 12,
                completedJobs: 15
            },
            {
                name: 'Sarah Designer',
                email: 'sarah@example.com',
                password: 'password123',
                role: 'freelancer',
                isEmailVerified: true,
                bio: 'UI/UX Designer specialized in modern web design',
                skills: ['Figma', 'Adobe XD', 'UI Design', 'Prototyping'],
                hourlyRate: 45,
                rating: 4.9,
                reviewCount: 20,
                completedJobs: 25
            },
            {
                name: 'Mike DataScientist',
                email: 'mike@example.com',
                password: 'password123',
                role: 'freelancer',
                isEmailVerified: true,
                bio: 'Data scientist and ML engineer',
                skills: ['Python', 'TensorFlow', 'Data Analysis', 'Machine Learning'],
                hourlyRate: 60,
                rating: 4.7,
                reviewCount: 8,
                completedJobs: 10
            }
        ]);

        // Create sample clients
        const clients = await User.create([
            {
                name: 'TechCorp LLC',
                email: 'contact@techcorp.com',
                password: 'password123',
                role: 'client',
                isEmailVerified: true,
                bio: 'Software development company',
                totalSpent: 5000
            },
            {
                name: 'StartupHub Inc',
                email: 'hire@startuphub.com',
                password: 'password123',
                role: 'client',
                isEmailVerified: true,
                bio: 'Innovative startup looking for talent',
                totalSpent: 3500
            }
        ]);

        console.log(`✅ Created ${freelancers.length} freelancers`);
        console.log(`✅ Created ${clients.length} clients`);

        // Create sample jobs
        const jobs = await Job.create([
            {
                title: 'Build a Modern E-commerce Website',
                description: 'Looking for an experienced developer to build a full-stack e-commerce platform with React and Node.js',
                client: clients[0]._id,
                category: 'Web Development',
                type: 'contract',
                budgetType: 'fixed',
                budget: 5000,
                skills: ['React', 'Node.js', 'MongoDB', 'Payment Integration'],
                experienceLevel: 'expert',
                status: 'open'
            },
            {
                title: 'Mobile App UI/UX Design',
                description: 'Need a talented designer to create beautiful UI/UX for our mobile fitness app',
                client: clients[1]._id,
                category: 'Design',
                type: 'contract',
                budgetType: 'hourly',
                hourlyRateMin: 40,
                hourlyRateMax: 60,
                skills: ['Figma', 'Mobile Design', 'User Research'],
                experienceLevel: 'intermediate',
                status: 'open'
            },
            {
                title: 'Data Analysis and Visualization',
                description: 'Analyze sales data and create interactive dashboards',
                client: clients[0]._id,
                category: 'Data Science',
                type: 'contract',
                budgetType: 'fixed',
                budget: 2500,
                skills: ['Python', 'Data Analysis', 'Visualization', 'SQL'],
                experienceLevel: 'expert',
                status: 'in-progress'
            }
        ]);

        console.log(`✅ Created ${jobs.length} jobs`);

        // Create sample proposals
        const proposals = await Proposal.create([
            {
                job: jobs[0]._id,
                freelancer: freelancers[0]._id,
                coverLetter: 'I have extensive experience building e-commerce platforms...',
                proposedRate: 4800,
                estimatedDuration: 30,
                status: 'pending'
            },
            {
                job: jobs[1]._id,
                freelancer: freelancers[1]._id,
                coverLetter: 'I would love to design your fitness app UI...',
                proposedRate: 50,
                estimatedDuration: 40,
                status: 'accepted'
            }
        ]);

        console.log(`✅ Created ${proposals.length} proposals`);

        // Create sample contracts
        const contracts = await Contract.create([
            {
                job: jobs[2]._id,
                client: clients[0]._id,
                freelancer: freelancers[2]._id,
                totalAmount: 2500,
                platformFee: 250,
                platformFeePercentage: 10,
                status: 'active',
                startDate: new Date()
            },
            {
                job: jobs[1]._id,
                client: clients[1]._id,
                freelancer: freelancers[1]._id,
                totalAmount: 2000,
                platformFee: 200,
                platformFeePercentage: 10,
                status: 'completed',
                startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
            }
        ]);

        console.log(`✅ Created ${contracts.length} contracts`);

        console.log('\n🎉 Sample data seeded successfully!');
        console.log('\n📊 Summary:');
        console.log(`   Freelancers: ${freelancers.length}`);
        console.log(`   Clients: ${clients.length}`);
        console.log(`   Jobs: ${jobs.length}`);
        console.log(`   Proposals: ${proposals.length}`);
        console.log(`   Contracts: ${contracts.length}`);
        console.log('\n✅ Your admin dashboard should now show stats and data!');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding data:', error);
        process.exit(1);
    }
};

seedData();

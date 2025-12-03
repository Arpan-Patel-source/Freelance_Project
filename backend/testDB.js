import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Job from './models/Job.js';

dotenv.config();

const testDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Check existing collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('\n📚 Existing Collections:');
    collections.forEach(col => console.log(`  - ${col.name}`));

    // Count documents in each collection
    console.log('\n📊 Document Counts:');
    const userCount = await User.countDocuments();
    const jobCount = await Job.countDocuments();
    console.log(`  - Users: ${userCount}`);
    console.log(`  - Jobs: ${jobCount}`);

    console.log('\n✅ Database test completed!');
    console.log('\n💡 Tip: Collections will be created when you first insert data through your API endpoints.');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

testDatabase();

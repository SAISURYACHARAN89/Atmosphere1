const mongoose = require('mongoose');
const { Follow } = require('../models');

const MONGO_URI = 'mongodb+srv://admin:admin123@atmosphere.dlcgylc.mongodb.net/atmosphere';

const seedFollows = async () => {
    const follows = [
        {
            follower: new mongoose.Types.ObjectId('64b5f0c2f1a4e2a5d6c8e001'),
            following: new mongoose.Types.ObjectId('64b5f0c2f1a4e2a5d6c8e002'),
        },
        {
            follower: new mongoose.Types.ObjectId('64b5f0c2f1a4e2a5d6c8e003'),
            following: new mongoose.Types.ObjectId('64b5f0c2f1a4e2a5d6c8e004'),
        },
    ];

    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        await Follow.deleteMany();
        await Follow.insertMany(follows);
        console.log('Follows seeded successfully');
    } catch (error) {
        console.error('Error seeding follows:', error);
    } finally {
        mongoose.connection.close();
    }
};

seedFollows();
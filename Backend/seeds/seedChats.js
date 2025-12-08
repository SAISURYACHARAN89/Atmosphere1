const mongoose = require('mongoose');
const { Chat } = require('../models');

const MONGO_URI = 'mongodb+srv://admin:admin123@atmosphere.dlcgylc.mongodb.net/atmosphere';

const seedChats = async () => {
    const chats = [
        {
            participants: [
                new mongoose.Types.ObjectId('64b5f0c2f1a4e2a5d6c8e001'),
                new mongoose.Types.ObjectId('64b5f0c2f1a4e2a5d6c8e002')
            ],
        },
        {
            participants: [
                new mongoose.Types.ObjectId('64b5f0c2f1a4e2a5d6c8e003'),
                new mongoose.Types.ObjectId('64b5f0c2f1a4e2a5d6c8e004')
            ],
        },
    ];

    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        await Chat.deleteMany();
        await Chat.insertMany(chats);
        console.log('Chats seeded successfully');
    } catch (error) {
        console.error('Error seeding chats:', error);
    } finally {
        mongoose.connection.close();
    }
};

seedChats();
const mongoose = require('mongoose');
const { Message } = require('../models');

const MONGO_URI = 'mongodb+srv://admin:admin123@atmosphere.dlcgylc.mongodb.net/atmosphere';

const seedMessages = async () => {
    const messages = [
        {
            chat: new mongoose.Types.ObjectId('64b5f0c2f1a4e2a5d6c8e001'), // Chat ID
            sender: new mongoose.Types.ObjectId('64b5f0c2f1a4e2a5d6c8e002'), // Sender ID
            content: 'Hello, how are you?',
        },
        {
            chat: new mongoose.Types.ObjectId('64b5f0c2f1a4e2a5d6c8e001'),
            sender: new mongoose.Types.ObjectId('64b5f0c2f1a4e2a5d6c8e003'),
            content: 'I am good, thank you!',
        },
        {
            chat: new mongoose.Types.ObjectId('64b5f0c2f1a4e2a5d6c8e004'),
            sender: new mongoose.Types.ObjectId('64b5f0c2f1a4e2a5d6c8e003'),
            content: 'Are we still on for the meeting?',
        },
        {
            chat: new mongoose.Types.ObjectId('64b5f0c2f1a4e2a5d6c8e004'),
            sender: new mongoose.Types.ObjectId('64b5f0c2f1a4e2a5d6c8e004'),
            content: 'Yes, let’s meet at 3 PM.',
        },
    ];

    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        await Message.deleteMany();
        await Message.insertMany(messages);
        console.log('Messages seeded successfully');
    } catch (error) {
        console.error('Error seeding messages:', error);
    } finally {
        mongoose.connection.close();
    }
};

seedMessages();
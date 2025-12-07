const mongoose = require('mongoose');
const { User, Chat, Message } = require('../models');
require('dotenv').config();

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/atmosphere_dev';

const verifyData = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        // Find the users
        const user1 = await User.findOne({ email: 'babblu2505@gmail.com' });
        const user2 = await User.findOne({ email: 'greencharge@example.com' });

        if (!user1 || !user2) {
            console.log('❌ One or both users not found!');
            return;
        }

        console.log('\n✅ Users found:');
        console.log('User 1:', user1.email, '-', user1._id);
        console.log('User 2:', user2.email, '-', user2._id);

        // Find the chat
        const chat = await Chat.findOne({
            participants: { $all: [user1._id, user2._id] },
        })
            .populate('participants', 'email displayName avatarUrl')
            .populate('lastMessage');

        if (!chat) {
            console.log('❌ Chat not found!');
            return;
        }

        console.log('\n✅ Chat found:');
        console.log('Chat ID:', chat._id);
        console.log('Participants:', chat.participants.map(p => p.email));
        console.log('Last Message:', chat.lastMessage?.body);

        // Find messages
        const messages = await Message.find({ chat: chat._id })
            .populate('sender', 'email displayName')
            .sort({ createdAt: 1 });

        console.log('\n✅ Messages found:', messages.length);
        messages.forEach((msg, idx) => {
            console.log(`${idx + 1}. [${msg.sender.email}]: ${msg.body}`);
        });

        console.log('\n✅ All data verification complete!');

    } catch (error) {
        console.error('Error verifying data:', error);
    } finally {
        mongoose.connection.close();
    }
};

verifyData();

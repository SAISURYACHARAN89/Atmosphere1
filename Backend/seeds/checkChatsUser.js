const mongoose = require('mongoose');
const { User, Chat } = require('../models');
require('dotenv').config();

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/atmosphere_dev';

(async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');
    
    // Find the user
    const user = await User.findOne({ email: 'babblu2505@gmail.com' });
    if (!user) {
      console.log('User not found!');
      mongoose.connection.close();
      return;
    }
    
    console.log('\n✅ User found:');
    console.log('User ID:', user._id);
    console.log('User Email:', user.email);
    
    // Find all chats with this user
    const chats = await Chat.find({ participants: user._id })
      .populate('participants', 'email displayName')
      .populate('lastMessage');
    
    console.log('\n✅ Chats found with this user:', chats.length);
    if (chats.length === 0) {
      console.log('❌ No chats found for this user!');
      console.log('\nChecking all chats in database...');
      const allChats = await Chat.find();
      console.log('Total chats in database:', allChats.length);
      allChats.forEach((chat, i) => {
        console.log(`\nAll Chat ${i+1}:`, {
          chatId: chat._id,
          participantCount: chat.participants.length,
          participants: chat.participants.map(p => p.toString()),
        });
      });
    } else {
      chats.forEach((chat, i) => {
        console.log(`\nChat ${i+1}:`, {
          chatId: chat._id,
          participants: chat.participants.map(p => ({ id: p._id, email: p.email, name: p.displayName })),
          hasMessages: !!chat.lastMessage
        });
      });
    }
    
    mongoose.connection.close();
  } catch (err) {
    console.error('Error:', err.message);
  }
})();

const mongoose = require('mongoose');
const { connect } = require('../index');
const { Chat, User, Message } = require('../models');

async function seedGroups() {
    await connect();
    
    // Find some users to add to groups
    const users = await User.find().limit(5);
    if (users.length < 2) {
        console.log('Not enough users to seed groups. Run seedUsers first.');
        process.exit(1);
    }

    const admin = users[0];
    const others = users.slice(1);

    const groups = [
        {
            name: 'Startup Founders Network',
            description: 'Connect with other founders',
            type: 'Public',
            participants: [admin._id, ...others.map(u => u._id)],
            admin: admin._id
        },
        {
            name: 'Tech Investors Hub',
            description: 'Discuss investment opportunities',
            type: 'Private',
            participants: [admin._id, others[0]._id],
            admin: admin._id
        },
        {
            name: 'AI & ML Enthusiasts',
            description: 'Everything AI',
            type: 'Public',
            participants: [admin._id, ...others.map(u => u._id)],
            admin: admin._id
        }
    ];

    for (const g of groups) {
        // Check if group exists
        const exists = await Chat.findOne({ groupName: g.name, isGroup: true });
        if (exists) {
            console.log(`Group ${g.name} already exists`);
            continue;
        }

        const chat = new Chat({
            isGroup: true,
            groupName: g.name,
            groupDescription: g.description,
            groupType: g.type,
            groupAdmin: g.admin,
            participants: g.participants,
            unreadCounts: {}
        });

        await chat.save();
        console.log(`Created group: ${g.name}`);

        // Add a welcome message
        const msg = new Message({
            chat: chat._id,
            sender: admin._id,
            content: `Welcome to ${g.name}!`
        });
        await msg.save();
        
        chat.lastMessage = msg._id;
        await chat.save();
    }

    console.log('Group seeding complete');
    process.exit(0);
}

seedGroups().catch(console.error);

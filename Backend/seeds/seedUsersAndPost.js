const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const fs = require('fs');
require('dotenv').config();
const { User, StartupDetails } = require('../models');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/atmosphere_dev';

const usersToCreate = [
    {
        email: 'airbound@example.com',
        username: 'airbound',
        password: 'airbound@example.com',
        displayName: 'Airbound.co',
        avatarUrl: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=100&h=100&fit=crop',
        startup: {
            companyName: 'Airbound.co',
            about: "We're building the future of last-mile delivery using autonomous drones. Our AI-powered logistics network reduces delivery costs by 60% while cutting carbon emissions in urban areas.",
            location: 'San Francisco, CA',
            companyType: 'Logistics Tech',
            establishedOn: new Date('2022-01-15'),
            address: '123 Drone Lane, San Francisco, CA',
            profileImage: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&h=600&fit=crop',
            verified: true,
            stage: 'Revenue Generating',
            rounds: 2,
            age: 2,
            fundingRaised: 2000000,
            fundingNeeded: 3000000,
            teamMembers: [{ name: 'John Founder', role: 'Founder & CEO' }, { name: 'Jane CTO', role: 'CTO' }],
            financialProfile: { revenueType: 'Capital Raised', fundingAmount: 2000000, stages: ['Seed', 'Series A'] }
        }
    },
    {
        email: 'neuralhealth@example.com',
        username: 'neuralhealth',
        password: 'neuralhealth@example.com',
        displayName: 'NeuralHealth',
        avatarUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=100&h=100&fit=crop',
        startup: {
            companyName: 'NeuralHealth',
            about: 'Our deep learning platform analyzes medical imaging with 98% accuracy, helping radiologists detect early-stage diseases. Currently deployed in 50+ hospitals across North America.',
            location: 'Boston, MA',
            companyType: 'HealthTech',
            establishedOn: new Date('2021-06-20'),
            address: '456 Medical Plaza, Boston, MA',
            profileImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=600&fit=crop',
            verified: true,
            stage: 'Seed',
            rounds: 1,
            age: 3,
            fundingRaised: 8000000,
            fundingNeeded: 6000000,
            teamMembers: [{ name: 'Dr. Emma Tech', role: 'Founder & CEO' }, { name: 'Dr. Michael ML', role: 'Head of ML' }],
            financialProfile: { revenueType: 'Capital Raised', fundingAmount: 8000000, stages: ['Seed'] }
        }
    },
    {
        email: 'greencharge@example.com',
        username: 'greencharge',
        password: 'greencharge@example.com',
        displayName: 'GreenCharge',
        avatarUrl: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=100&h=100&fit=crop',
        startup: {
            companyName: 'GreenCharge',
            about: 'Solar-powered EV charging stations with smart grid integration. We\'ve installed 200+ charging points and partnered with major retail chains to expand green charging accessibility.',
            location: 'Austin, TX',
            companyType: 'CleanTech',
            establishedOn: new Date('2021-03-10'),
            address: '789 Solar Street, Austin, TX',
            profileImage: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&h=600&fit=crop',
            verified: true,
            stage: 'Revenue Generating',
            rounds: 2,
            age: 3,
            fundingRaised: 5000000,
            fundingNeeded: 0,
            teamMembers: [{ name: 'Alex Green', role: 'Founder & CEO' }, { name: 'Sarah Solar', role: 'VP Operations' }],
            financialProfile: { revenueType: 'Capital Raised', fundingAmount: 5000000, stages: ['Seed', 'Series A'] }
        }
    }
];

async function seed() {
    await mongoose.connect(MONGODB_URI);

    const createdUsers = [];

    for (const u of usersToCreate) {
        let existing = await User.findOne({ email: u.email });
        if (existing) {
            console.log('User exists:', u.email);
            createdUsers.push(existing);
            continue;
        }

        const passwordHash = await bcrypt.hash(u.password, 10);
        const user = new User({
            email: u.email.toLowerCase(),
            username: u.username,
            passwordHash,
            displayName: u.displayName,
            avatarUrl: u.avatarUrl,
            verified: true,
            roles: ['startup']
        });
        await user.save();
        console.log('Created user:', u.email);
        createdUsers.push(user);

        // Create startup details for this user
        const existingStartup = await StartupDetails.findOne({ user: user._id });
        if (!existingStartup) {
            const startupDetails = new StartupDetails({
                user: user._id,
                ...u.startup
            });
            await startupDetails.save();
            console.log('Created startup details for:', u.email);
        }
    }

    // Write users.txt at repo root with email:password lines
    const usersTxtPath = require('path').resolve(__dirname, '..', '..', 'users.txt');
    const lines = usersToCreate.map(u => `${u.email}:${u.password}`).join('\n');
    fs.writeFileSync(usersTxtPath, lines, { encoding: 'utf8' });
    console.log('Wrote users.txt with credentials to', usersTxtPath);

    await mongoose.disconnect();
    console.log('Seed completed successfully!');
}

seed().catch(err => { console.error(err); process.exit(1); });

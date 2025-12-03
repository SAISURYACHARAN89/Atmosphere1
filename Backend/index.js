const mongoose = require('mongoose');
require('dotenv').config();
const models = require('./models');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/atmosphere_dev';

async function connect() {
    try {
        // `useNewUrlParser` and `useUnifiedTopology` are no longer supported options
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('MongoDB connection error', err);
        throw err;
    }
}

async function close() {
    await mongoose.disconnect();
}

module.exports = { connect, close, models };

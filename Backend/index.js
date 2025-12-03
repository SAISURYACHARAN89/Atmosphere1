const mongoose = require('mongoose');
require('dotenv').config();
const models = require('./models');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/atmosphere_dev';

async function connect() {
    try {
        await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('MongoDB connection error', err);
        process.exit(1);
    }
}

async function close() {
    await mongoose.disconnect();
}

module.exports = { connect, close, models };
const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/atmosphere_dev';

mongoose
    .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
        process.exit(0);
    })
    .catch((err) => {
        console.error('MongoDB connection error', err);
        process.exit(1);
    });

// Backfill migration: populate `fundingRaised` from `financialProfile.fundingAmount`
// Usage: set MONGO_URI if needed, then run `node Backend/scripts/migrateFundingRaised.js`

const mongoose = require('mongoose');
const path = require('path');

async function run() {
    try {
        const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/atmosphere';
        console.log('Connecting to MongoDB at', mongoUri);
        await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });

        // Require models after connecting
        const StartupDetails = require('../models/StartupDetails');

        // Find documents where financialProfile.fundingAmount exists
        const cursor = StartupDetails.find({ 'financialProfile.fundingAmount': { $exists: true, $ne: null } }).cursor();

        let updated = 0;
        let processed = 0;

        for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
            processed += 1;
            const fp = doc.financialProfile && doc.financialProfile.fundingAmount;
            const fpNum = fp ? Number(fp) : 0;
            const current = Number(doc.fundingRaised || 0);

            if (isNaN(fpNum)) continue;

            // Update if different or missing
            if (current !== fpNum) {
                doc.fundingRaised = fpNum;
                await doc.save();
                updated += 1;
                console.log(`Updated ${doc._id}: fundingRaised ${current} -> ${fpNum}`);
            }
        }

        console.log(`Processed ${processed} documents, updated ${updated} documents.`);
        await mongoose.disconnect();
        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err);
        try { await mongoose.disconnect(); } catch (e) { /* ignore */ }
        process.exit(1);
    }
}

run();

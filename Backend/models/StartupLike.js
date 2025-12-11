const mongoose = require('mongoose');

const StartupLikeSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    startup: { type: mongoose.Schema.Types.ObjectId, ref: 'StartupDetails', required: true },
    createdAt: { type: Date, default: Date.now }
});

// Ensure unique like per user/startup
StartupLikeSchema.index({ user: 1, startup: 1 }, { unique: true });

module.exports = mongoose.model('StartupLike', StartupLikeSchema);

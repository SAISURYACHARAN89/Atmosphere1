const mongoose = require('mongoose');
const { Schema } = mongoose;

const VerificationStatusSchema = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        role: { type: String },
        status: { type: String, enum: ['requested', 'in_review', 'approved', 'rejected'], default: 'requested' },
        requestedAt: { type: Date, default: Date.now },
        approvedAt: Date,
        adminId: { type: Schema.Types.ObjectId, ref: 'User' },
        meta: { type: Schema.Types.Mixed },
    },
    { timestamps: true }
);

module.exports = mongoose.model('VerificationStatus', VerificationStatusSchema);
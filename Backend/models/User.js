const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema(
    {
        supabaseId: { type: String, index: true },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        phone: { type: String, trim: true },
        username: { type: String, required: true, unique: true, trim: true },
        passwordHash: { type: String },
        fullName: { type: String },
        bio: { type: String },
        avatarUrl: { type: String },
        roles: { type: [String], default: ['personal'], enum: ['investor', 'startup', 'personal', 'admin'] },
        otpVerified: { type: Boolean, default: false }, // Email OTP verified
        verified: { type: Boolean, default: false }, // Profile verified (by admin/system)
        profileSetupComplete: { type: Boolean, default: false }, // Initial profile setup done
        onboardingStep: { type: Number, default: 0 },
        blocked: { type: Boolean, default: false },
        blockedAt: { type: Date },
        blockedReason: { type: String },
        deletedAt: { type: Date, default: null },
        kycCompleted: { type: Boolean, default: false }, // KYC verification completed & verified
        kycCompletedAt: { type: Date },
        portfolioComplete: { type: Boolean, default: false }, // Investor portfolio step done
        links: {
            website: String,
            linkedin: String,
            twitter: String,
        },
        meta: { type: Schema.Types.Mixed },
    },
    { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);
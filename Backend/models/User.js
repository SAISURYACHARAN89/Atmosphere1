const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema(
    {
        supabaseId: { type: String, index: true },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        username: { type: String, required: true, unique: true, trim: true },
        passwordHash: { type: String },
        displayName: { type: String },
        bio: { type: String },
        avatarUrl: { type: String },
        roles: { type: [String], default: ['personal'] },
        verified: { type: Boolean, default: false },
        deletedAt: { type: Date, default: null },
        links: {
            website: String,
            linkedin: String,
            twitter: String,
        },
        meta: { type: Schema.Types.Mixed },
    },
    { timestamps: true }
);

UserSchema.index({ email: 1 });
UserSchema.index({ username: 1 });

module.exports = mongoose.model('User', UserSchema);
const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema(
    {
        supabaseId: { type: String, index: true },
        email: { type: String, required: true, unique: true, index: true },
        username: { type: String, required: true, unique: true, index: true },
        displayName: { type: String },
        bio: { type: String },
        avatarUrl: { type: String },
        roles: [{ type: String, enum: ['startup', 'investor', 'personal', 'admin'] }],
        verified: { type: Boolean, default: false },
        links: {
            website: String,
            linkedin: String,
            twitter: String,
        },
        location: { type: String },
        contactPhone: { type: String },
        meta: { type: Schema.Types.Mixed },
        deletedAt: { type: Date },
    },
    { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);

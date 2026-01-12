const mongoose = require('mongoose');
const { Schema } = mongoose;

const ChatSchema = new Schema(
    {
        participants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        lastMessage: { type: Schema.Types.ObjectId, ref: 'Message' },
        unreadCounts: { type: Schema.Types.Mixed, default: {} },
        isGroup: { type: Boolean, default: false },
        groupName: { type: String },
        groupDescription: { type: String },
        groupImage: { type: String },
        groupType: { type: String, enum: ['Public', 'Private', 'Verified'], default: 'Public' },
        groupAdmin: { type: Schema.Types.ObjectId, ref: 'User' },
        isJobGroup: { type: Boolean, default: false },
        jobId: { type: Schema.Types.ObjectId, ref: 'Job' },
        meta: { type: Schema.Types.Mixed },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Chat', ChatSchema);
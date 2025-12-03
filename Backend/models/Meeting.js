const mongoose = require('mongoose');
const { Schema } = mongoose;

const MeetingSchema = new Schema(
    {
        host: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        title: { type: String },
        description: { type: String },
        startTime: { type: Date },
        endTime: { type: Date },
        participants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        location: String,
        link: String,
        reminderSent: { type: Boolean, default: false },
        meta: { type: Schema.Types.Mixed },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Meeting', MeetingSchema);
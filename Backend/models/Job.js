const mongoose = require('mongoose');
const { Schema } = mongoose;

const JobSchema = new Schema(
    {
        poster: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        startupId: { type: Schema.Types.ObjectId, ref: 'Company' },
        chatGroupId: { type: Schema.Types.ObjectId, ref: 'Chat' },
        title: { type: String, required: true },
        startupName: { type: String },
        sector: { type: String },
        locationType: { type: String },
        employmentType: { type: String },
        isRemote: { type: Boolean, default: false },
        compensation: { type: String },
        description: { type: String },
        requirements: { type: String },
        customQuestions: [{ type: String }],
        applicationUrl: { type: String },
        applicants: [{
            userId: { type: Schema.Types.ObjectId, ref: 'User' },
            responses: [{
                question: { type: String },
                answer: { type: String }
            }],
            resumeUrl: { type: String },
            appliedAt: { type: Date, default: Date.now }
        }],
        isVerifiedByAdmin: { type: Boolean, default: false },
        status: { type: String, enum: ['active', 'closed'], default: 'active' },
        meta: { type: Schema.Types.Mixed },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Job', JobSchema);

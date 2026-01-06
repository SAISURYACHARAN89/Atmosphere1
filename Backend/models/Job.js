const mongoose = require('mongoose');
const { Schema } = mongoose;

const JobSchema = new Schema(
    {
        poster: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        startupId: { type: Schema.Types.ObjectId, ref: 'Company' },
        title: { type: String, required: true },
        sector: { type: String },
        locationType: { type: String },
        employmentType: { type: String },
        compensation: { type: String },
        requirements: { type: String },
        customQuestions: { type: [String] }, // Deprecated, kept for backwards compatibility
        applicationUrl: { type: String },
        applicants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        isVerifiedByAdmin: { type: Boolean, default: false },
        meta: { type: Schema.Types.Mixed },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Job', JobSchema);
const mongoose = require('mongoose');
const { Schema } = mongoose;

const MediaSchema = new Schema({
    url: String,
    type: { type: String, enum: ['image', 'video', 'file'], default: 'image' },
    thumbUrl: String,
});

const PostSchema = new Schema(
    {
        author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        content: { type: String },
        media: { type: [MediaSchema], default: [] },
        visibility: { type: String, enum: ['public', 'private'], default: 'public' },
        likesCount: { type: Number, default: 0 },
        commentsCount: { type: Number, default: 0 },
        sharesCount: { type: Number, default: 0 },
        tags: { type: [String], default: [] },
        meta: { type: Schema.Types.Mixed },
    },
    { timestamps: true }
);

PostSchema.index({ author: 1, createdAt: -1 });

module.exports = mongoose.model('Post', PostSchema);
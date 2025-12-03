const mongoose = require('mongoose');
const { Schema } = mongoose;

const AuditLogSchema = new Schema(
    {
        actor: { type: Schema.Types.ObjectId, ref: 'User' },
        targetType: String,
        targetId: Schema.Types.ObjectId,
        action: String,
        data: Schema.Types.Mixed,
    },
    { timestamps: true }
);

module.exports = mongoose.model('AuditLog', AuditLogSchema);
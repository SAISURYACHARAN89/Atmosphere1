const mongoose = require('mongoose');
const { Schema } = mongoose;

const PortfolioSchema = new Schema(
    {
        owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        items: [{ type: Schema.Types.ObjectId, ref: 'Asset' }],
        meta: { type: Schema.Types.Mixed },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Portfolio', PortfolioSchema);
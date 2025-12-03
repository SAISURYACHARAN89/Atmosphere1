const { VerificationDocument, VerificationStatus } = require('../models');

exports.uploadDocument = async (req, res, next) => {
    try {
        const { type, storageKey, url } = req.body;

        if (!type || !url) {
            return res.status(400).json({ error: 'Type and URL are required' });
        }

        const document = new VerificationDocument({ user: req.user._id, type, storageKey, url, status: 'pending' });
        await document.save();
        res.status(201).json({ document });
    } catch (err) {
        next(err);
    }
};

exports.listUserDocuments = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const documents = await VerificationDocument.find({ user: userId }).populate('reviewedBy', 'username displayName').sort({ createdAt: -1 });
        res.json({ documents });
    } catch (err) {
        next(err);
    }
};

exports.getStatus = async (req, res, next) => {
    try {
        const statuses = await VerificationStatus.find({ user: req.user._1d ? req.user._1d : req.user._id })
            .populate('adminId', 'username displayName')
            .sort({ createdAt: -1 });

        res.json({ statuses });
    } catch (err) {
        next(err);
    }
};

exports.submitVerification = async (req, res, next) => {
    try {
        const { role } = req.body;

        if (!role) {
            return res.status(400).json({ error: 'Role is required' });
        }

        const existing = await VerificationStatus.findOne({ user: req.user._id, role, status: { $in: ['requested', 'in_review'] } });
        if (existing) return res.status(409).json({ error: 'Verification already in progress for this role' });

        const verification = new VerificationStatus({ user: req.user._id, role, status: 'requested' });
        await verification.save();
        res.status(201).json({ verification });
    } catch (err) {
        next(err);
    }
};

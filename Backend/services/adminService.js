const { VerificationDocument, VerificationStatus, AuditLog, User } = require('../models');

exports.getPendingVerifications = async (req, res, next) => {
    try {
        const { limit = 20, skip = 0, type } = req.query;

        const filter = { status: { $in: ['requested', 'in_review'] } };
        if (type) filter.role = type;

        const verifications = await VerificationStatus.find(filter)
            .populate('user', 'username displayName email avatarUrl')
            .sort({ requestedAt: 1 })
            .limit(parseInt(limit))
            .skip(parseInt(skip));

        res.json({ verifications, count: verifications.length });
    } catch (err) {
        next(err);
    }
};

exports.getUserDocuments = async (req, res, next) => {
    try {
        const { userId } = req.params;

        const documents = await VerificationDocument.find({ user: userId })
            .populate('user', 'username displayName email')
            .populate('reviewedBy', 'username displayName')
            .sort({ createdAt: -1 });

        res.json({ documents });
    } catch (err) {
        next(err);
    }
};

exports.approveVerification = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { notes } = req.body;

        const verification = await VerificationStatus.findById(id);
        if (!verification) {
            return res.status(404).json({ error: 'Verification not found' });
        }

        verification.status = 'approved';
        verification.approvedAt = new Date();
        verification.adminId = req.user._id;
        if (notes) verification.meta = { ...verification.meta, notes };

        await verification.save();

        await User.findByIdAndUpdate(verification.user, { verified: true });

        await VerificationDocument.updateMany(
            { user: verification.user },
            { status: 'approved', reviewedBy: req.user._id, reviewedAt: new Date() }
        );

        const auditLog = new AuditLog({
            actor: req.user._id,
            targetType: 'VerificationStatus',
            targetId: verification._id,
            action: 'approve',
            data: { role: verification.role, notes },
        });
        await auditLog.save();

        res.json({ verification, message: 'Verification approved successfully' });
    } catch (err) {
        next(err);
    }
};

exports.rejectVerification = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;

        if (!reason) {
            return res.status(400).json({ error: 'Rejection reason is required' });
        }

        const verification = await VerificationStatus.findById(id);
        if (!verification) {
            return res.status(404).json({ error: 'Verification not found' });
        }

        verification.status = 'rejected';
        verification.adminId = req.user._id;
        verification.meta = { ...verification.meta, rejectionReason: reason };

        await verification.save();

        await VerificationDocument.updateMany(
            { user: verification.user },
            { status: 'rejected', reviewedBy: req.user._id, reviewedAt: new Date(), notes: reason }
        );

        const auditLog = new AuditLog({
            actor: req.user._id,
            targetType: 'VerificationStatus',
            targetId: verification._id,
            action: 'reject',
            data: { role: verification.role, reason },
        });
        await auditLog.save();

        res.json({ verification, message: 'Verification rejected' });
    } catch (err) {
        next(err);
    }
};

exports.getAuditLogs = async (req, res, next) => {
    try {
        const { limit = 50, skip = 0, action, targetType } = req.query;

        const filter = {};
        if (action) filter.action = action;
        if (targetType) filter.targetType = targetType;

        const logs = await AuditLog.find(filter)
            .populate('actor', 'username displayName email')
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .skip(parseInt(skip));

        res.json({ logs, count: logs.length });
    } catch (err) {
        next(err);
    }
};

exports.getUsers = async (req, res, next) => {
    try {
        const { limit = 50, skip = 0, role, verified, search } = req.query;

        const filter = {};
        if (role) filter.roles = role;
        if (verified !== undefined) filter.verified = verified === 'true';
        if (search) {
            filter.$or = [
                { username: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { displayName: { $regex: search, $options: 'i' } },
            ];
        }

        const users = await User.find(filter)
            .select('-passwordHash')
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .skip(parseInt(skip));

        const total = await User.countDocuments(filter);

        res.json({ users, count: users.length, total });
    } catch (err) {
        next(err);
    }
};

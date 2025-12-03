const { StartupDetails } = require('../models');

exports.createStartup = async (req, res, next) => {
    try {
        const { companyName, about, location, companyType, establishedOn, address, teamMembers, financialProfile, previousInvestments } = req.body;
        const existing = await StartupDetails.findOne({ user: req.user._id });
        if (existing) return res.status(409).json({ error: 'Startup details already exist for this user' });

        const startupDetails = new StartupDetails({ user: req.user._id, companyName, about, location, companyType, establishedOn, address, teamMembers: teamMembers || [], financialProfile, previousInvestments: previousInvestments || [] });
        await startupDetails.save();
        res.status(201).json({ startupDetails });
    } catch (err) { next(err); }
};

exports.getStartupByUser = async (req, res, next) => {
    try {
        const startupDetails = await StartupDetails.findOne({ user: req.params.userId }).populate('user', 'username displayName avatarUrl');
        if (!startupDetails) return res.status(404).json({ error: 'Startup details not found' });
        res.json({ startupDetails });
    } catch (err) { next(err); }
};

exports.updateStartup = async (req, res, next) => {
    try {
        const startupDetails = await StartupDetails.findById(req.params.id);
        if (!startupDetails) return res.status(404).json({ error: 'Startup details not found' });
        if (startupDetails.user.toString() !== req.user._id.toString()) return res.status(403).json({ error: 'Forbidden' });

        const allowedFields = ['companyName', 'about', 'location', 'companyType', 'establishedOn', 'address', 'teamMembers', 'financialProfile', 'previousInvestments'];
        allowedFields.forEach(field => { if (req.body[field] !== undefined) startupDetails[field] = req.body[field]; });
        await startupDetails.save();
        res.json({ startupDetails });
    } catch (err) { next(err); }
};

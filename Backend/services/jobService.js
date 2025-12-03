const { Job, Notification } = require('../models');

exports.createJob = async (req, res, next) => {
    try {
        const { title, company, description, location, type, sector, experienceLevel, salary, currency, skills } = req.body;

        if (!title || !company || !description || !location || !type) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const job = new Job({ postedBy: req.user._id, title, company, description, location, type, sector, experienceLevel, salary, currency, skills: skills || [] });
        await job.save();
        await job.populate('postedBy', 'username displayName avatarUrl verified');

        res.status(201).json({ job });
    } catch (err) {
        next(err);
    }
};

exports.listJobs = async (req, res, next) => {
    try {
        const { limit = 20, skip = 0, sector, location, type, experienceLevel, search, postedBy } = req.query;

        const filter = { status: 'active' };
        if (sector) filter.sector = sector;
        if (location) filter.location = { $regex: location, $options: 'i' };
        if (type) filter.type = type;
        if (experienceLevel) filter.experienceLevel = experienceLevel;
        if (postedBy) filter.postedBy = postedBy;
        if (search) filter.$or = [{ title: { $regex: search, $options: 'i' } }, { company: { $regex: search, $options: 'i' } }, { description: { $regex: search, $options: 'i' } }];

        const jobs = await Job.find(filter)
            .populate('postedBy', 'username displayName avatarUrl verified')
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .skip(parseInt(skip));

        const total = await Job.countDocuments(filter);

        res.json({ jobs, count: jobs.length, total });
    } catch (err) {
        next(err);
    }
};

exports.getJob = async (req, res, next) => {
    try {
        const { id } = req.params;

        const job = await Job.findById(id)
            .populate('postedBy', 'username displayName avatarUrl verified')
            .populate('applicants.userId', 'username displayName avatarUrl verified');

        if (!job) return res.status(404).json({ error: 'Job not found' });

        const isOwner = req.user && job.postedBy._id.toString() === req.user._id.toString();
        const jobData = job.toObject();
        if (!isOwner) jobData.applicants = jobData.applicants.length;

        res.json({ job: jobData, isOwner });
    } catch (err) {
        next(err);
    }
};

exports.updateJob = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const job = await Job.findById(id);
        if (!job) return res.status(404).json({ error: 'Job not found' });
        if (job.postedBy.toString() !== req.user._id.toString()) return res.status(403).json({ error: 'Access denied' });

        const allowedUpdates = ['title', 'company', 'description', 'location', 'type', 'sector', 'experienceLevel', 'salary', 'currency', 'skills', 'status'];
        allowedUpdates.forEach(field => { if (updates[field] !== undefined) job[field] = updates[field]; });

        await job.save();
        await job.populate('postedBy', 'username displayName avatarUrl verified');

        res.json({ job });
    } catch (err) {
        next(err);
    }
};

exports.deleteJob = async (req, res, next) => {
    try {
        const { id } = req.params;

        const job = await Job.findById(id);
        if (!job) return res.status(404).json({ error: 'Job not found' });
        if (job.postedBy.toString() !== req.user._id.toString()) return res.status(403).json({ error: 'Access denied' });

        await job.deleteOne();
        res.json({ message: 'Job deleted successfully' });
    } catch (err) {
        next(err);
    }
};

exports.applyToJob = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { coverLetter, resumeUrl } = req.body;

        const job = await Job.findById(id);
        if (!job) return res.status(404).json({ error: 'Job not found' });
        if (job.status !== 'active') return res.status(400).json({ error: 'Job is not accepting applications' });

        const alreadyApplied = job.applicants.some(app => app.userId.toString() === req.user._id.toString());
        if (alreadyApplied) return res.status(400).json({ error: 'Already applied to this job' });

        job.applicants.push({ userId: req.user._id, coverLetter, resumeUrl, appliedAt: new Date() });
        await job.save();

        const notification = new Notification({ user: job.postedBy, actor: req.user._id, type: 'job_application', payload: { jobId: job._id, jobTitle: job.title } });
        await notification.save();

        res.json({ message: 'Application submitted successfully' });
    } catch (err) {
        next(err);
    }
};

exports.getApplicants = async (req, res, next) => {
    try {
        const { id } = req.params;
        const job = await Job.findById(id).populate('applicants.userId', 'username displayName avatarUrl verified');
        if (!job) return res.status(404).json({ error: 'Job not found' });
        if (job.postedBy.toString() !== req.user._id.toString()) return res.status(403).json({ error: 'Access denied' });

        res.json({ applicants: job.applicants });
    } catch (err) {
        next(err);
    }
};

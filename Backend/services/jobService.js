const { Job, Notification, StartupDetails, Chat, Message, User } = require('../models');

// Check if user can post jobs (investor or startup only)
const canPostJobs = (user) => {
    const allowedRoles = ['investor', 'startup'];
    // User.roles is an array, check if any allowed role is present
    if (Array.isArray(user.roles)) {
        return user.roles.some(role => allowedRoles.includes(role));
    }
    // Fallback for role or accountType as string
    return allowedRoles.includes(user.role) || allowedRoles.includes(user.accountType);
};

exports.createJob = async (req, res, next) => {
    try {
        // Check if user is allowed to post jobs
        if (!canPostJobs(req.user)) {
            return res.status(403).json({ error: 'Only investors and startups can post jobs' });
        }

        const {
            title,
            startupName,
            sector,
            locationType,
            employmentType,
            isRemote,
            compensation,
            description,
            requirements,
            customQuestions,
            applicationUrl
        } = req.body;

        if (!title || !requirements) {
            return res.status(400).json({ error: 'Title and requirements are required' });
        }

        // Create the job first
        const job = new Job({
            poster: req.user._id,
            title,
            startupName: startupName || '',
            sector,
            locationType,
            employmentType,
            isRemote: isRemote || false,
            compensation,
            description,
            requirements,
            customQuestions: customQuestions || [],
            applicationUrl: applicationUrl || '',
            status: 'active'
        });
        await job.save();

        // Create a group chat for this job
        const chat = new Chat({
            participants: [req.user._id],
            isGroup: true,
            groupName: `${title} - Applications`,
            groupDescription: `Job applications for ${title}`,
            groupType: 'Private',
            groupAdmin: req.user._id,
            isJobGroup: true,
            jobId: job._id
        });
        await chat.save();

        // Link the chat to the job
        job.chatGroupId = chat._id;
        await job.save();

        await job.populate('poster', 'username displayName avatarUrl verified');

        // Get startup details to include company name
        const startupDetails = await StartupDetails.findOne({ user: req.user._id });
        const jobData = job.toObject();
        if (startupDetails) {
            jobData.startupName = jobData.startupName || startupDetails.companyName;
        }
        jobData.chatGroupId = chat._id;

        res.status(201).json({ job: jobData, chat });
    } catch (err) {
        next(err);
    }
};

exports.listJobs = async (req, res, next) => {
    try {
        const { limit = 20, skip = 0, sector, locationType, employmentType, search, poster, status } = req.query;
        const filter = {};
        if (sector) filter.sector = sector;
        if (locationType) filter.locationType = { $regex: locationType, $options: 'i' };
        if (employmentType) filter.employmentType = employmentType;
        if (poster) filter.poster = poster;
        if (status) filter.status = status;
        if (search) filter.$or = [
            { title: { $regex: search, $options: 'i' } },
            { requirements: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } }
        ];

        const jobs = await Job.find(filter)
            .populate('poster', 'username displayName fullName avatarUrl verified roles')
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .skip(parseInt(skip));
        const total = await Job.countDocuments(filter);

        // Fetch startup and investor details for all posters
        const posterIds = [...new Set(jobs.map(job => job.poster?._id?.toString()).filter(Boolean))];
        const startupDetailsMap = {};
        const investorDetailsMap = {};

        if (posterIds.length > 0) {
            // Get startup details
            const startupDetails = await StartupDetails.find({ user: { $in: posterIds } });
            startupDetails.forEach(sd => {
                startupDetailsMap[sd.user.toString()] = sd.companyName;
            });

            // Get investor details (for investor posters)
            const { InvestorDetails } = require('../models');
            const investorDetails = await InvestorDetails.find({ user: { $in: posterIds } });
            investorDetails.forEach(id => {
                investorDetailsMap[id.user.toString()] = id.displayName || id.fullName || '';
            });
        }

        // Add display info and applicant count to each job
        const jobsWithDetails = jobs.map(job => {
            const jobData = job.toObject();
            if (job.poster?._id) {
                const posterId = job.poster._id.toString();
                // Use job's startupName, or startup details, or investor details
                if (!jobData.startupName) {
                    jobData.startupName = startupDetailsMap[posterId] || investorDetailsMap[posterId] || '';
                }
            }
            jobData.applicantCount = jobData.applicants?.length || 0;
            // Don't expose full applicant data in list view
            delete jobData.applicants;
            return jobData;
        });

        res.json({ jobs: jobsWithDetails, count: jobs.length, total });
    } catch (err) {
        next(err);
    }
};

exports.getJob = async (req, res, next) => {
    try {
        const { id } = req.params;

        const job = await Job.findById(id)
            .populate('poster', 'username displayName avatarUrl verified')
            .populate('applicants.userId', 'username displayName avatarUrl verified');

        if (!job) return res.status(404).json({ error: 'Job not found' });

        const isOwner = req.user && job.poster._id.toString() === req.user._id.toString();
        const jobData = job.toObject();

        // Only show applicant details to owner
        if (!isOwner) {
            jobData.applicantCount = jobData.applicants?.length || 0;
            delete jobData.applicants;
        }

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
        if (job.poster.toString() !== req.user._id.toString()) return res.status(403).json({ error: 'Access denied' });

        const allowedUpdates = ['title', 'startupName', 'description', 'locationType', 'employmentType', 'isRemote', 'sector', 'compensation', 'requirements', 'customQuestions', 'applicationUrl', 'status'];
        allowedUpdates.forEach(field => { if (updates[field] !== undefined) job[field] = updates[field]; });

        await job.save();
        await job.populate('poster', 'username displayName avatarUrl verified');

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
        if (job.poster.toString() !== req.user._id.toString()) return res.status(403).json({ error: 'Access denied' });

        // Also delete the associated chat group
        if (job.chatGroupId) {
            await Message.deleteMany({ chat: job.chatGroupId });
            await Chat.findByIdAndDelete(job.chatGroupId);
        }

        await job.deleteOne();
        res.json({ message: 'Job deleted successfully' });
    } catch (err) {
        next(err);
    }
};

exports.applyToJob = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { responses, resumeUrl } = req.body;

        const job = await Job.findById(id).populate('poster', 'username displayName');
        if (!job) return res.status(404).json({ error: 'Job not found' });
        if (job.status !== 'active') return res.status(400).json({ error: 'Job is not accepting applications' });

        // Check if already applied
        const alreadyApplied = job.applicants.some(app => app.userId.toString() === req.user._id.toString());
        if (alreadyApplied) return res.status(400).json({ error: 'Already applied to this job' });

        // Add applicant with form responses
        job.applicants.push({
            userId: req.user._id,
            responses: responses || [],
            resumeUrl: resumeUrl || '',
            appliedAt: new Date()
        });
        await job.save();

        // Add user to job's group chat if it exists
        if (job.chatGroupId) {
            const chat = await Chat.findById(job.chatGroupId);
            if (chat) {
                // Add user to participants if not already there
                if (!chat.participants.some(p => p.toString() === req.user._id.toString())) {
                    chat.participants.push(req.user._id);
                    await chat.save();
                }

                // Always send application data as a message in the chat
                const applicantUser = await User.findById(req.user._id).select('username displayName');
                let messageContent = `📋 **New Application from ${applicantUser.displayName || applicantUser.username}**\n\n`;

                if (responses && responses.length > 0) {
                    responses.forEach((resp, idx) => {
                        messageContent += `**Q${idx + 1}: ${resp.question}**\n${resp.answer}\n\n`;
                    });
                }

                if (resumeUrl) {
                    messageContent += `📄 Resume: ${resumeUrl}`;
                }

                const message = new Message({
                    chat: job.chatGroupId,
                    sender: req.user._id,
                    body: messageContent,
                    meta: {
                        isApplicationMessage: true,
                        applicantId: req.user._id
                    }
                });
                await message.save();

                chat.lastMessage = message._id;
                await chat.save();
            }
        }

        // Create notification for job poster
        const notification = new Notification({
            user: job.poster._id,
            actor: req.user._id,
            type: 'job_application',
            payload: { jobId: job._id, jobTitle: job.title }
        });
        await notification.save();

        res.json({ message: 'Application submitted successfully', chatGroupId: job.chatGroupId });
    } catch (err) {
        next(err);
    }
};

exports.getApplicants = async (req, res, next) => {
    try {
        const { id } = req.params;
        const job = await Job.findById(id)
            .populate('applicants.userId', 'username displayName avatarUrl verified email');

        if (!job) return res.status(404).json({ error: 'Job not found' });
        if (job.poster.toString() !== req.user._id.toString()) return res.status(403).json({ error: 'Access denied' });

        res.json({
            applicants: job.applicants,
            jobTitle: job.title,
            customQuestions: job.customQuestions
        });
    } catch (err) {
        next(err);
    }
};

exports.getMyAppliedJobs = async (req, res, next) => {
    try {
        const jobs = await Job.find({ 'applicants.userId': req.user._id })
            .populate('poster', 'username displayName avatarUrl verified')
            .sort({ createdAt: -1 });

        const jobsWithStatus = jobs.map(job => {
            const jobData = job.toObject();
            const myApplication = job.applicants.find(app => app.userId.toString() === req.user._id.toString());
            jobData.myApplication = myApplication;
            jobData.applicantCount = job.applicants.length;
            delete jobData.applicants;
            return jobData;
        });

        res.json({ jobs: jobsWithStatus });
    } catch (err) {
        next(err);
    }
};

exports.getMyPostedJobs = async (req, res, next) => {
    try {
        const jobs = await Job.find({ poster: req.user._id })
            .sort({ createdAt: -1 });

        const jobsWithCounts = jobs.map(job => {
            const jobData = job.toObject();
            jobData.applicantCount = job.applicants?.length || 0;
            return jobData;
        });

        res.json({ jobs: jobsWithCounts });
    } catch (err) {
        next(err);
    }
};

exports.exportApplicants = async (req, res, next) => {
    try {
        const { id } = req.params;
        const job = await Job.findById(id)
            .populate('applicants.userId', 'username displayName email avatarUrl verified');

        if (!job) return res.status(404).json({ error: 'Job not found' });
        if (job.poster.toString() !== req.user._id.toString()) return res.status(403).json({ error: 'Access denied' });

        // Build CSV data
        const headers = ['Name', 'Username', 'Email', 'Applied At'];

        // Add custom question headers
        if (job.customQuestions && job.customQuestions.length > 0) {
            job.customQuestions.forEach((q, idx) => {
                headers.push(`Q${idx + 1}: ${q}`);
            });
        }
        headers.push('Resume URL');

        const rows = job.applicants.map(applicant => {
            const row = [
                applicant.userId?.displayName || '',
                applicant.userId?.username || '',
                applicant.userId?.email || '',
                applicant.appliedAt ? new Date(applicant.appliedAt).toISOString() : ''
            ];

            // Add responses
            if (job.customQuestions && job.customQuestions.length > 0) {
                job.customQuestions.forEach((question, idx) => {
                    const response = applicant.responses?.find(r => r.question === question);
                    row.push(response?.answer || '');
                });
            }

            row.push(applicant.resumeUrl || '');
            return row;
        });

        // Create CSV content
        const escapeCSV = (val) => {
            if (val === null || val === undefined) return '';
            const str = String(val);
            if (str.includes(',') || str.includes('"') || str.includes('\n')) {
                return `"${str.replace(/"/g, '""')}"`;
            }
            return str;
        };

        const csvContent = [
            headers.map(escapeCSV).join(','),
            ...rows.map(row => row.map(escapeCSV).join(','))
        ].join('\n');

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="${job.title.replace(/[^a-z0-9]/gi, '_')}_applicants.csv"`);
        res.send(csvContent);
    } catch (err) {
        next(err);
    }
};

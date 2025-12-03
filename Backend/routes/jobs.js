const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const jobService = require('../services/jobService');

router.post('/', authMiddleware, jobService.createJob);
router.get('/', jobService.listJobs);
router.get('/:id', jobService.getJob);
router.put('/:id', authMiddleware, jobService.updateJob);
router.delete('/:id', authMiddleware, jobService.deleteJob);
router.post('/:id/apply', authMiddleware, jobService.applyToJob);
router.get('/:id/applicants', authMiddleware, jobService.getApplicants);

module.exports = router;

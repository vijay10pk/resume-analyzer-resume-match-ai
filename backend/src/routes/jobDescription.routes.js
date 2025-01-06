const express = require('express');
const router = express.Router();
const jobDescriptionController = require('../controllers/jobDescription.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');

// All routes require authentication
router.use(authenticateToken);

// Job Description routes
router.post('/', jobDescriptionController.createJobDescription);
router.get('/', jobDescriptionController.getUserJobs);
router.get('/:id', jobDescriptionController.getJob);
router.put('/:id', jobDescriptionController.updateJob);
router.delete('/:id', jobDescriptionController.deleteJob);

module.exports = router;

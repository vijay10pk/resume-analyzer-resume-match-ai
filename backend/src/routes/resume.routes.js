const express = require('express');
const router = express.Router();
const resumeController = require('../controllers/resume.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');
const { upload, handleUploadError } = require('../middlewares/upload.middleware');

// Protected routes
router.use(authenticateToken);

// Upload new resume (with error handling)
router.post('/upload', 
    upload.single('file'),
    handleUploadError,
    resumeController.uploadResume
);

router.get('/', resumeController.getUserResumes);
router.get('/:id', resumeController.getResume);
router.delete('/:id', resumeController.deleteResume);
// router.post('/:resumeId/compare/:jobDescriptionId', resumeController.compareWithJob); // Compare resume with a job description

module.exports = router;

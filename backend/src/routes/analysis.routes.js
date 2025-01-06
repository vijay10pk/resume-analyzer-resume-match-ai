const express = require('express');
const router = express.Router();
const analysisController = require('../controllers/analysis.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');

// All routes require authentication
router.use(authenticateToken);

// Analysis specific routes
router.get('/', analysisController.getUserAnalyses);
router.get('/:id', analysisController.getAnalysis);
router.delete('/:id', analysisController.deleteAnalysis);
router.post('/compare/:resumeId/:jobId', analysisController.compareResumeWithJob);

module.exports = router;

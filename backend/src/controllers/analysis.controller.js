// controllers/analysis.controller.js
const AnalysisResult = require('../models/analysisResult.model');
const Resume = require('../models/resume.model');
const JobDescription = require('../models/jobDescription.model');
const aiUtils = require('../utils/ai.utils');

const analysisController = {
    // Compare a resume with a job description
    async compareResumeWithJob(req, res) {
        try {
            const { resumeId, jobId } = req.params;
            const userId = req.user.id;
    
            const resume = await Resume.findById(resumeId);
            const job = await JobDescription.findById(jobId);
    
            if (!resume || !job) {
                return res.status(404).json({ 
                    error: 'Resume or job description not found' 
                });
            }
    
            if (resume.user_id !== userId || job.user_id !== userId) {
                return res.status(403).json({ error: 'Unauthorized' });
            }
    
            console.log('Starting comparison with:', {
                resumeId,
                jobId,
                resumeSkills: resume.skills,
                jobRequiredSkills: job.required_skills
            });
    
            const analysisResult = await aiUtils.compareWithResume(
                {
                    skills: resume.skills,
                    experience: resume.parsed_data.experience,
                    education: resume.parsed_data.education,
                    rawText: resume.original_content
                },
                {
                    description: job.original_content,
                    required_skills: job.required_skills,
                    preferred_skills: job.preferred_skills,
                    title: job.title,
                    metadata: job.job_metadata
                }
            );
    
            console.log('Analysis result:', analysisResult);
    
            const analysis = await AnalysisResult.create({
                resume_id: resumeId,
                job_description_id: jobId,
                match_percentage: analysisResult.match_percentage,
                matching_skills: analysisResult.matching_skills,
                missing_skills: analysisResult.missing_skills,
                analysis_details: analysisResult.detailed_analysis
            });
    
            res.json({
                message: 'Analysis completed successfully',
                analysis: analysis.toJSON()
            });
        } catch (error) {
            console.error('Error performing analysis:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    // Get all analyses for the current user
    async getUserAnalyses(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const offset = (page - 1) * limit;

            const analyses = await AnalysisResult.findByUserId(req.user.id, limit, offset);
            
            // Get associated resume and job details for each analysis
            const enrichedAnalyses = await Promise.all(
                analyses.map(async (analysis) => {
                    const resume = await Resume.findById(analysis.resume_id);
                    const job = await JobDescription.findById(analysis.job_description_id);
                    return {
                        ...analysis.toJSON(),
                        resume_title: resume?.title || 'Resume not found',
                        job_title: job?.title || 'Job not found'
                    };
                })
            );

            res.json({
                analyses: enrichedAnalyses,
                pagination: { page, limit, offset }
            });
        } catch (error) {
            console.error('Error fetching analyses:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    // Get a specific analysis by ID
    async getAnalysis(req, res) {
        try {
            const analysisId = req.params.id;
            const userId = req.user.id;

            const analysis = await AnalysisResult.findById(analysisId);
            if (!analysis) {
                return res.status(404).json({ error: 'Analysis not found' });
            }

            // Get resume and job details
            const resume = await Resume.findById(analysis.resume_id);
            const job = await JobDescription.findById(analysis.job_description_id);

            // Check ownership
            if (!resume || !job || resume.user_id !== userId || job.user_id !== userId) {
                return res.status(403).json({ error: 'Unauthorized' });
            }

            res.json({
                analysis: {
                    ...analysis.toJSON(),
                    resume_details: {
                        title: resume.title,
                        skills: resume.skills
                    },
                    job_details: {
                        title: job.title,
                        company: job.company,
                        required_skills: job.required_skills,
                        preferred_skills: job.preferred_skills
                    }
                }
            });
        } catch (error) {
            console.error('Error fetching analysis:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    // Delete an analysis
    async deleteAnalysis(req, res) {
        try {
            const analysisId = req.params.id;
            const userId = req.user.id;

            const analysis = await AnalysisResult.findById(analysisId);
            if (!analysis) {
                return res.status(404).json({ error: 'Analysis not found' });
            }

            // Verify ownership through resume
            const resume = await Resume.findById(analysis.resume_id);
            if (!resume || resume.user_id !== userId) {
                return res.status(403).json({ error: 'Unauthorized' });
            }

            await analysis.delete();
            res.json({ message: 'Analysis deleted successfully' });
        } catch (error) {
            console.error('Error deleting analysis:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    // Get analysis summary/statistics
    async getAnalyticsSummary(req, res) {
        try {
            const userId = req.user.id;
            const resumeId = req.query.resumeId; // Optional filter by resume

            // Get analysis statistics
            const stats = await AnalysisResult.getStats(userId, resumeId);

            // Get recent analyses
            const recentAnalyses = await AnalysisResult.findByUserId(userId, 5, 0);
            
            res.json({
                statistics: {
                    total_analyses: stats.total_analyses,
                    average_match: stats.avg_match_percentage,
                    highest_match: stats.highest_match,
                    lowest_match: stats.lowest_match
                },
                recent_analyses: recentAnalyses.map(analysis => analysis.toJSON())
            });
        } catch (error) {
            console.error('Error fetching analytics:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
};

module.exports = analysisController;

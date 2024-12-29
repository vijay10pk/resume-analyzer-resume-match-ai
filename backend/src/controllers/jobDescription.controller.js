const JobDescription = require('../models/jobDescription.model');
const aiUtils = require('../utils/ai.utils');
const AnalysisResult = require('../models/analysisResult.model');

const jobDescriptionController = {
    async createJobDescription(req, res) {
        try {
            // Get jobText from request body
            const jobText = req.body.jobText;
            console.log('Request body:', req.body); // Debug log

            if (!jobText || jobText.trim().length === 0) {
                return res.status(400).json({ 
                    error: 'Job description text is required and cannot be empty' 
                });
            }

            const userId = req.user.id;

            try {
                // Parse the job description using AI
                const parsedJob = await aiUtils.parseJobDescription(jobText);

                if (!parsedJob.title) {
                    throw new Error('Failed to extract job title from description');
                }

                // Create job description record
                const jobDescription = await JobDescription.create({
                    user_id: userId,
                    title: parsedJob.title,
                    company: parsedJob.company || 'Unknown Company',
                    original_content: jobText,
                    required_skills: parsedJob.required_skills || [],
                    preferred_skills: parsedJob.preferred_skills || [],
                    job_metadata: {
                        employment_type: parsedJob.job_metadata?.employment_type || 'Not specified',
                        experience_level: parsedJob.job_metadata?.experience_level || 'Not specified',
                        location: parsedJob.job_metadata?.location || 'Not specified',
                        salary_range: parsedJob.job_metadata?.salary_range || {
                            min: null,
                            max: null,
                            currency: 'USD'
                        }
                    }
                });

                res.status(201).json({
                    message: 'Job description created successfully',
                    jobDescription: jobDescription.toJSON(),
                    parsed_data: {
                        title: parsedJob.title,
                        company: parsedJob.company,
                        required_skills: parsedJob.required_skills,
                        preferred_skills: parsedJob.preferred_skills,
                        parsed_sections: parsedJob.parsed_sections
                    }
                });
            } catch (parseError) {
                console.error('Error parsing job description:', parseError);
                return res.status(400).json({ 
                    error: 'Could not parse job description. Please check the format and try again.' 
                });
            }
        } catch (error) {
            console.error('Error creating job description:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    async getUserJobs(req, res) {
        try {
            const userId = req.user.id;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const offset = (page - 1) * limit;

            const jobs = await JobDescription.findByUserId(userId, limit, offset);
            
            res.json({
                jobs: jobs.map(job => job.toJSON()),
                pagination: { page, limit, offset }
            });
        } catch (error) {
            console.error('Error fetching jobs:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    async getJob(req, res) {
        try {
            const job = await JobDescription.findById(req.params.id);
            
            if (!job) {
                return res.status(404).json({ error: 'Job description not found' });
            }

            if (job.user_id !== req.user.id) {
                return res.status(403).json({ error: 'Unauthorized' });
            }

            res.json({ job: job.toJSON() });
        } catch (error) {
            console.error('Error fetching job:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    async updateJob(req, res) {
        try {
            const job = await JobDescription.findById(req.params.id);
            
            if (!job) {
                return res.status(404).json({ error: 'Job description not found' });
            }

            if (job.user_id !== req.user.id) {
                return res.status(403).json({ error: 'Unauthorized' });
            }

            const updatedJob = await job.update(req.body);
            res.json({ 
                message: 'Job description updated successfully',
                job: updatedJob.toJSON() 
            });
        } catch (error) {
            console.error('Error updating job:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    async deleteJob(req, res) {
        try {
            const job = await JobDescription.findById(req.params.id);
            
            if (!job) {
                return res.status(404).json({ error: 'Job description not found' });
            }

            if (job.user_id !== req.user.id) {
                return res.status(403).json({ error: 'Unauthorized' });
            }

            await job.delete();
            res.json({ message: 'Job description deleted successfully' });
        } catch (error) {
            console.error('Error deleting job:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
/* 
    async compareWithResume(req, res) {
        try {
            const { jobId, resumeId } = req.params;
            const userId = req.user.id;

            const job = await JobDescription.findById(jobId);
            const resume = await Resume.findById(resumeId);

            if (!job || !resume) {
                return res.status(404).json({ error: 'Job description or resume not found' });
            }

            if (job.user_id !== userId || resume.user_id !== userId) {
                return res.status(403).json({ error: 'Unauthorized' });
            }

            const analysis = await jobParserUtils.compareWithResume(
                resume.parsed_data,
                {
                    description: job.original_content,
                    required_skills: job.required_skills,
                    preferred_skills: job.preferred_skills
                }
            );

            const analysisResult = await AnalysisResult.create({
                resume_id: resumeId,
                job_description_id: jobId,
                match_percentage: analysis.match_percentage,
                matching_skills: analysis.matching_skills,
                missing_skills: analysis.missing_skills,
                analysis_details: analysis.detailed_analysis
            });

            res.json({
                message: 'Analysis completed successfully',
                analysis: analysisResult.toJSON()
            });
        } catch (error) {
            console.error('Error comparing with resume:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    async getJobAnalyses(req, res) {
        try {
            const jobId = req.params.jobId;
            const job = await JobDescription.findById(jobId);

            if (!job || job.user_id !== req.user.id) {
                return res.status(404).json({ error: 'Job description not found' });
            }

            const analyses = await AnalysisResult.findByJobId(jobId);
            res.json({ analyses: analyses.map(analysis => analysis.toJSON()) });
        } catch (error) {
            console.error('Error fetching analyses:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    async getAnalysis(req, res) {
        try {
            const analysis = await AnalysisResult.findById(req.params.analysisId);
            
            if (!analysis) {
                return res.status(404).json({ error: 'Analysis not found' });
            }

            const job = await JobDescription.findById(analysis.job_description_id);
            if (job.user_id !== req.user.id) {
                return res.status(403).json({ error: 'Unauthorized' });
            }

            res.json({ analysis: analysis.toJSON() });
        } catch (error) {
            console.error('Error fetching analysis:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    } */
};

module.exports = jobDescriptionController;

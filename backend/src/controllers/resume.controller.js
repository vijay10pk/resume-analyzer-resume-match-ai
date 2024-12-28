const Resume = require('../models/resume.model');
const storageUtils = require('../utils/storage.utils');
const aiUtils = require('../utils/ai.utils');
// const AnalysisResult = require('../models/analysis.result.model');

const resumeController = {
    async uploadResume(req, res) {
        try {
            const file = req.file;
            const { title } = req.body;
            const userId = req.user.id;

            if (!file || !title) {
                return res.status(400).json({ error: 'File and title are required' });
            }

            // Validate file type
            storageUtils.validateFile(file);

            // Save file
            const storedFile = await storageUtils.saveFile(file);

            // Parse resume using AI
            const { parsed_data, skills } = await aiUtils.parseResume(file);
            console.log('Parsed Data received in controller:', {
                rawText: parsed_data.rawText ? parsed_data.rawText.substring(0, 100) + '...' : 'No raw text',
                skills: skills
            });

            // Create resume record
            const resume = await Resume.create({
                user_id: userId,
                title: storedFile.originalName.replace(/\.pdf$/i, ""),
                original_content: parsed_data.rawText,
                file_path: storedFile.filePath,
                parsed_data: parsed_data,
                skills: skills,
                metadata: {
                    originalName: storedFile.originalName,
                    mimeType: storedFile.mimeType,
                    size: storedFile.size,
                    uploadDate: new Date().toISOString()
                }
            });

            res.status(201).json({
                message: 'Resume uploaded successfully',
                resume: resume.toJSON()
            });
        } catch (error) {
            console.error('Error uploading resume:', error);
            
            // Handle specific errors
            if (error.message.includes('Invalid file type') || 
                error.message.includes('File and title')) {
                return res.status(400).json({ error: error.message });
            }
            
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    /* // Add a new method for job comparison
    async compareWithJob(req, res) {
        try {
            const { resumeId, jobDescriptionId } = req.params;
            const userId = req.user.id;

            // Fetch resume and job description
            const resume = await Resume.findById(resumeId);
            const jobDescription = await JobDescription.findById(jobDescriptionId);

            if (!resume || !jobDescription) {
                return res.status(404).json({ error: 'Resume or job description not found' });
            }

            if (resume.user_id !== userId || jobDescription.user_id !== userId) {
                return res.status(403).json({ error: 'Unauthorized' });
            }

            // Perform AI analysis
            const analysis = await aiUtils.compareWithJob(
                resume.parsed_data,
                jobDescription.original_content
            );

            // Store analysis results
            const analysisResult = await AnalysisResult.create({
                resume_id: resumeId,
                job_description_id: jobDescriptionId,
                match_percentage: analysis.matchPercentage,
                matching_skills: analysis.matchingSkills,
                missing_skills: analysis.missingSkills,
                analysis_details: analysis
            });

            res.json({
                message: 'Analysis completed successfully',
                analysis: analysisResult
            });
        } catch (error) {
            console.error('Error comparing resume with job:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }, */

    async getResume(req, res) {
        try {
            const resume = await Resume.findById(req.params.id);
            
            if (!resume) {
                return res.status(404).json({ error: 'Resume not found' });
            }

            if (resume.user_id !== req.user.id) {
                return res.status(403).json({ error: 'Unauthorized' });
            }

            res.json({ resume: resume.toJSON() });
        } catch (error) {
            console.error('Error fetching resume:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    async getUserResumes(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const offset = (page - 1) * limit;

            const resumes = await Resume.findByUserId(req.user.id, limit, offset);
            
            res.json({
                resumes: resumes.map(resume => resume.toJSON()),
                pagination: { page, limit, offset }
            });
        } catch (error) {
            console.error('Error fetching resumes:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    async deleteResume(req, res) {
        try {
            const resume = await Resume.findById(req.params.id);
            
            if (!resume) {
                return res.status(404).json({ error: 'Resume not found' });
            }

            if (resume.user_id !== req.user.id) {
                return res.status(403).json({ error: 'Unauthorized' });
            }

            // Delete file
            await storageUtils.deleteFile(resume.file_path);
            
            // Delete database record
            await resume.delete();

            res.json({ message: 'Resume deleted successfully' });
        } catch (error) {
            console.error('Error deleting resume:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
};

module.exports = resumeController;

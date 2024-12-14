const Resume = require('../models/resume.model');
const storageUtils = require('../utils/storage.utils');

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

            // Create resume record
            const resume = await Resume.create({
                user_id: userId,
                title: storedFile.originalName.replace(/\.pdf$/i, ""),
                // original_content: file.buffer.toString(),
                original_content: `Content will be parsed from file: ${storedFile.originalName}`,
                file_path: storedFile.filePath,
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
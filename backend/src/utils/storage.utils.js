const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const storageUtils = {
    async saveFile(file, directory = 'uploads/resumes') {
        try {
            await fs.mkdir(directory, { recursive: true });
            
            const fileId = uuidv4();
            const extension = path.extname(file.originalname);
            const fileName = `${fileId}${extension}`;
            const filePath = path.join(directory, fileName);

            await fs.writeFile(filePath, file.buffer);

            return {
                fileId,
                fileName,
                filePath,
                originalName: file.originalname,
                mimeType: file.mimetype,
                size: file.size
            };
        } catch (error) {
            console.error('File storage error:', error);
            throw new Error('Error saving file');
        }
    },

    validateFile(file) {
        const allowedMimes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ];

        if (!allowedMimes.includes(file.mimetype)) {
            throw new Error('Invalid file type. Only PDF and Word documents are allowed.');
        }
        return true;
    },

    async deleteFile(filePath) {
        try {
            // Check if file exists
            const fileExists = await fs.access(filePath)
                .then(() => true)
                .catch(() => false);
            
            if (!fileExists) {
                console.warn(`File not found: ${filePath}`);
                return false;
            }

            // Delete the file
            await fs.unlink(filePath);
            return true;
        } catch (error) {
            console.error('File deletion error:', error);
            throw new Error('Error deleting file');
        }
    }
};

module.exports = storageUtils;
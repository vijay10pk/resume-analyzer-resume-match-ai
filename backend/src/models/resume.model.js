const dbUtils = require('../utils/db.utils');

class Resume {
    constructor(data) {
        this.id = data.id;
        this.user_id = data.user_id;
        this.title = data.title;
        this.original_content = data.original_content;
        this.file_path = data.file_path;
        this.parsed_data = data.parsed_data;
        this.skills = data.skills;
        this.metadata = data.metadata;
        this.created_at = data.created_at;
        this.updated_at = data.updated_at;
    }

    static async create(resumeData) {
        try {
            const result = await dbUtils.query(
                `INSERT INTO resumes (
                    user_id, title, original_content, file_path, 
                    parsed_data, skills, metadata
                ) VALUES ($1, $2, $3, $4, $5, $6, $7)
                RETURNING *`,
                [
                    resumeData.user_id,
                    resumeData.title,
                    resumeData.original_content,
                    resumeData.file_path,
                    resumeData.parsed_data || {},
                    resumeData.skills || [],
                    resumeData.metadata || {}
                ]
            );
            return new Resume(result.rows[0]);
        } catch (error) {
            throw error;
        }
    }

    static async findById(id) {
        try {
            const result = await dbUtils.query(
                'SELECT * FROM resumes WHERE id = $1',
                [id]
            );
            return result.rows[0] ? new Resume(result.rows[0]) : null;
        } catch (error) {
            throw new Error('Error finding resume by id');
        }
    }

    static async findByUserId(userId, limit = 10, offset = 0) {
        try {
            const result = await dbUtils.query(
                `SELECT * FROM resumes 
                 WHERE user_id = $1 
                 ORDER BY created_at DESC 
                 LIMIT $2 OFFSET $3`,
                [userId, limit, offset]
            );
            return result.rows.map(resume => new Resume(resume));
        } catch (error) {
            throw new Error('Error finding resumes');
        }
    }

    async delete() {
        try {
            await dbUtils.query(
                'DELETE FROM resumes WHERE id = $1',
                [this.id]
            );
            return true;
        } catch (error) {
            throw new Error('Error deleting resume');
        }
    }

    toJSON() {
        return {
            id: this.id,
            user_id: this.user_id,
            title: this.title,
            file_path: this.file_path,
            parsed_data: this.parsed_data,
            skills: this.skills,
            metadata: this.metadata,
            created_at: this.created_at,
            updated_at: this.updated_at
        };
    }
}

module.exports = Resume;
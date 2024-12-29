const dbUtils = require('../utils/db.utils');

class JobDescription {
    constructor(data) {
        this.id = data.id;
        this.user_id = data.user_id;
        this.title = data.title;
        this.company = data.company;
        this.original_content = data.original_content;
        this.required_skills = data.required_skills || [];
        this.preferred_skills = data.preferred_skills || [];
        this.job_metadata = data.job_metadata || {};
        this.created_at = data.created_at;
        this.updated_at = data.updated_at;
    }

    static async create(jobData) {
        try {
            const result = await dbUtils.query(
                `INSERT INTO job_descriptions (
                    user_id, title, company, original_content, 
                    required_skills, preferred_skills, job_metadata
                ) VALUES ($1, $2, $3, $4, $5, $6, $7)
                RETURNING *`,
                [
                    jobData.user_id,
                    jobData.title,
                    jobData.company,
                    jobData.original_content,
                    jobData.required_skills || [],
                    jobData.preferred_skills || [],
                    jobData.job_metadata || {}
                ]
            );
            return new JobDescription(result.rows[0]);
        } catch (error) {
            throw error;
        }
    }

    static async findById(id) {
        const result = await dbUtils.query(
            'SELECT * FROM job_descriptions WHERE id = $1',
            [id]
        );
        return result.rows[0] ? new JobDescription(result.rows[0]) : null;
    }

    static async findByUserId(userId, limit = 10, offset = 0) {
        const result = await dbUtils.query(
            `SELECT * FROM job_descriptions 
             WHERE user_id = $1 
             ORDER BY created_at DESC 
             LIMIT $2 OFFSET $3`,
            [userId, limit, offset]
        );
        return result.rows.map(job => new JobDescription(job));
    }

    async delete() {
        try {
            const result = await dbUtils.query(
                'DELETE FROM job_descriptions WHERE id = $1 RETURNING *',
                [this.id]
            );
            return result.rowCount > 0;
        } catch (error) {
            console.error('Error deleting job:', error);
            throw new Error('Failed to delete job description');
        }
    }

    async update(updateData) {
        const result = await dbUtils.query(
            `UPDATE job_descriptions 
             SET title = $1, company = $2, original_content = $3,
                 required_skills = $4, preferred_skills = $5, 
                 job_metadata = $6, updated_at = CURRENT_TIMESTAMP
             WHERE id = $7
             RETURNING *`,
            [
                updateData.title || this.title,
                updateData.company || this.company,
                updateData.original_content || this.original_content,
                updateData.required_skills || this.required_skills,
                updateData.preferred_skills || this.preferred_skills,
                updateData.job_metadata || this.job_metadata,
                this.id
            ]
        );
        Object.assign(this, result.rows[0]);
        return this;
    }

    toJSON() {
        return {
            id: this.id,
            user_id: this.user_id,
            title: this.title,
            company: this.company,
            original_content: this.original_content,
            required_skills: this.required_skills,
            preferred_skills: this.preferred_skills,
            job_metadata: this.job_metadata,
            created_at: this.created_at,
            updated_at: this.updated_at
        };
    }
}

module.exports = JobDescription;

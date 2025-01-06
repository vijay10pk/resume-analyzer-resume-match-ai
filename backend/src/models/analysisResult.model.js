const dbUtils = require('../utils/db.utils');

class AnalysisResult {
    constructor(data) {
        this.id = data.id;
        this.resume_id = data.resume_id;
        this.job_description_id = data.job_description_id;
        this.match_percentage = data.match_percentage || 0;
        this.matching_skills = data.matching_skills || [];
        this.missing_skills = data.missing_skills || [];
        this.analysis_details = data.analysis_details || {};
        this.created_at = data.created_at;
    }

    static async create(analysisData) {
        try {
            const result = await dbUtils.query(
                `INSERT INTO analysis_results (
                    resume_id, job_description_id, match_percentage,
                    matching_skills, missing_skills, analysis_details
                ) VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING *`,
                [
                    analysisData.resume_id,
                    analysisData.job_description_id,
                    analysisData.match_percentage || 0,
                    analysisData.matching_skills || [],
                    analysisData.missing_skills || [],
                    analysisData.analysis_details || {}
                ]
            );
            return new AnalysisResult(result.rows[0]);
        } catch (error) {
            console.error('Error creating analysis result:', error);
            throw error;
        }
    }

    static async findByResumeAndJob(resumeId, jobId) {
        const result = await dbUtils.query(
            `SELECT * FROM analysis_results 
             WHERE resume_id = $1 AND job_description_id = $2
             ORDER BY created_at DESC LIMIT 1`,
            [resumeId, jobId]
        );
        return result.rows[0] ? new AnalysisResult(result.rows[0]) : null;
    }

    toJSON() {
        return {
            id: this.id,
            resume_id: this.resume_id,
            job_description_id: this.job_description_id,
            match_percentage: this.match_percentage,
            matching_skills: this.matching_skills,
            missing_skills: this.missing_skills,
            analysis_details: this.analysis_details,
            created_at: this.created_at
        };
    }
}

module.exports = AnalysisResult;

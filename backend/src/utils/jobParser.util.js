// utils/jobParser.utils.js
const { model } = require('../config/ai.config');

const jobParserUtils = {
    /**
     * Clean and structure the AI response
     */
    cleanResponse(text) {
        try {
            // Remove markdown code block syntax if present
            const cleanText = text.replace(/```json\n?|\n?```/g, '').trim();
            return JSON.parse(cleanText);
        } catch (error) {
            console.error('Error cleaning response:', error);
            throw new Error('Invalid response format');
        }
    },

    /**
     * Parse job description text into structured JSON
     */
    async parseJobDescription(text) {
        try {
            const prompt = `
            Analyze the following job description and extract key information.
            Return ONLY a JSON object with the following structure, no additional text:
            {
                "title": "Job title",
                "company": "Company name if mentioned",
                "original_content": "The original complete text",
                "required_skills": ["skill1", "skill2"],
                "preferred_skills": ["skill1", "skill2"],
                "job_metadata": {
                    "employment_type": "Full-time/Part-time/Contract",
                    "experience_level": "Entry/Mid/Senior",
                    "location": "Location or Remote",
                    "salary_range": {
                        "min": number or null,
                        "max": number or null,
                        "currency": "USD/EUR/etc"
                    }
                },
                "parsed_sections": {
                    "description": "General job description",
                    "responsibilities": ["responsibility1", "responsibility2"],
                    "requirements": ["requirement1", "requirement2"],
                    "benefits": ["benefit1", "benefit2"]
                }
            }

            Job Description Text:
            ${text}`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const parsed = this.cleanResponse(response.text());

            // Add original content if not present
            parsed.original_content = text;

            // Validate required fields
            if (!parsed.title || !parsed.required_skills) {
                throw new Error('Failed to extract essential job information');
            }

            return parsed;
        } catch (error) {
            console.error('Job parsing error:', error);
            // Return a basic structure with original content preserved
            return {
                title: "Untitled Position",
                company: "",
                original_content: text,
                required_skills: [],
                preferred_skills: [],
                job_metadata: {
                    employment_type: null,
                    experience_level: null,
                    location: null,
                    salary_range: {
                        min: null,
                        max: null,
                        currency: null
                    }
                },
                parsed_sections: {
                    description: text,
                    responsibilities: [],
                    requirements: [],
                    benefits: []
                }
            };
        }
    },

    /**
     * Extract skills from text (can be used independently)
     */
    async extractSkills(text) {
        try {
            const prompt = `
            Extract all technical and professional skills from the text.
            Return ONLY a JSON object with this structure, no additional text:
            {
                "required_skills": ["skill1", "skill2"],
                "preferred_skills": ["skill1", "skill2"]
            }

            Text:
            ${text}`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            return this.cleanResponse(response.text());
        } catch (error) {
            console.error('Skills extraction error:', error);
            return {
                required_skills: [],
                preferred_skills: []
            };
        }
    }
};

module.exports = jobParserUtils;

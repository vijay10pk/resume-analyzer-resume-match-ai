// utils/ai.utils.js
const { model } = require('../config/ai.config');
const pdfParse = require('pdf-parse');

const aiUtils = {
    cleanJsonResponse(text) {
        try {
            // Remove markdown code block syntax if present
            const cleanText = text.replace(/```json\n?|\n?```/g, '').trim();
            return JSON.parse(cleanText);
        } catch (error) {
            console.error('Error cleaning JSON response:', error);
            throw new Error('Invalid JSON response from AI');
        }
    },

    async extractTextFromFile(file) {
        try {
            if (file.mimetype === 'application/pdf') {
                const pdfData = await pdfParse(file.buffer);
                return pdfData.text;
            } else if (file.mimetype === 'application/msword' || 
                      file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                // For now, just convert buffer to string for .doc/.docx
                // You might want to add specific Word document parsing here
                return file.buffer.toString('utf-8');
            }
            return file.buffer.toString('utf-8');
        } catch (error) {
            console.error('Text extraction error:', error);
            throw new Error('Failed to extract text from file');
        }
    },

    async parseResume(file) {
        try {

            // Extract text from file first
            const textContent = await this.extractTextFromFile(file);

            const prompt = `
            Analyze the following resume content and extract key information in a structured format.
            Return only a JSON object with the following structure:
            {
                "rawText": "The complete parsed text content",
                "personalInfo": { "name": "", "email": "", "phone": "", "location": "" },
                "skills": ["skill1", "skill2"],
                "experience": [{ "title": "", "company": "", "duration": "", "description": "" }],
                "education": [{ "degree": "", "institution": "", "year": "" }],
                "certifications": ["cert1", "cert2"]
            }
            
            Resume content:
            ${textContent}`;

            try {
                const result = await model.generateContent(prompt);
                const response = await result.response;
                const parsedData = this.cleanJsonResponse(response.text());
                  
                parsedData.rawText = textContent;
                return {
                    parsed_data: parsedData,
                    skills: parsedData.skills || []
                };
            } catch (error) {
                if (error.status === 429) {
                    // Fallback for rate limit: Return basic structure with original content
                    console.warn('AI rate limit reached, using fallback parsing');
                    return {
                        parsed_data: {
                            rawText: content,
                            personalInfo: {},
                            skills: [],
                            experience: [],
                            education: [],
                            certifications: []
                        },
                        skills: []
                    };
                }
                throw error;
            }
        } catch (error) {
            console.error('AI parsing error:', error);
            if (error.status === 429) {
                // If it's a rate limit error, don't throw
                return {
                    parsed_data: {
                        rawText: content,
                        personalInfo: {},
                        skills: [],
                        experience: [],
                        education: [],
                        certifications: []
                    },
                    skills: []
                };
            }
            throw new Error('Failed to parse resume content');
        }
    },

    async parseJobDescription(text) {
        try {
            console.log('Input text for parsing:', text); // Debug log

            const prompt = `
            Analyze the following job description and extract key information.
            Return ONLY a JSON object with EXACTLY this structure (no additional text or explanation):
            {
                "title": "exact job title from the text",
                "company": "company name if mentioned, or null if not found",
                "required_skills": ["skill1", "skill2"],
                "preferred_skills": ["skill1", "skill2"],
                "job_metadata": {
                    "employment_type": "Full-time/Part-time/Contract",
                    "experience_level": "Entry/Mid/Senior",
                    "location": "Location or Remote",
                    "salary_range": {
                        "min": number or null,
                        "max": number or null,
                        "currency": "USD"
                    }
                },
                "parsed_sections": {
                    "description": "main job description",
                    "responsibilities": ["duty1", "duty2"],
                    "requirements": ["requirement1", "requirement2"],
                    "benefits": ["benefit1", "benefit2"]
                }
            }

            Job Description:
            ${text}`;

            const result = await model.generateContent(prompt);
            const response = await result.response;

            const parsed = this.cleanJsonResponse(response.text());

            // Validate required fields
            if (!parsed.title) {
                throw new Error('No job title found in the description');
            }

            return {
                title: parsed.title,
                company: parsed.company || null,
                required_skills: parsed.required_skills || [],
                preferred_skills: parsed.preferred_skills || [],
                job_metadata: {
                    employment_type: parsed.job_metadata?.employment_type || 'Not specified',
                    experience_level: parsed.job_metadata?.experience_level || 'Not specified',
                    location: parsed.job_metadata?.location || 'Not specified',
                    salary_range: parsed.job_metadata?.salary_range || {
                        min: null,
                        max: null,
                        currency: 'USD'
                    }
                },
                parsed_sections: parsed.parsed_sections || {
                    description: text.substring(0, 200) + '...',
                    responsibilities: [],
                    requirements: [],
                    benefits: []
                }
            };
        } catch (error) {
            console.error('AI parsing error:', error);
            // Return a basic structure with original content preserved
            return {
                title: text.split('\n')[0] || 'Untitled Position', // Take first line as title
                company: null,
                required_skills: [],
                preferred_skills: [],
                job_metadata: {
                    employment_type: 'Not specified',
                    experience_level: 'Not specified',
                    location: 'Not specified',
                    salary_range: {
                        min: null,
                        max: null,
                        currency: 'USD'
                    }
                },
                parsed_sections: {
                    description: text.substring(0, 200) + '...',
                    responsibilities: [],
                    requirements: [],
                    benefits: []
                }
            };
        }
    },

    async compareWithResume(resumeData, jobData) {
        try {
            console.log('Comparing Resume Data:', JSON.stringify(resumeData, null, 2));
            console.log('With Job Data:', JSON.stringify(jobData, null, 2));
    
            const prompt = `
            Compare the following resume with the job description and provide a detailed analysis.
            Focus on matching skills, experience relevance, and providing specific recommendations.
    
            Resume Data:
            ${JSON.stringify(resumeData, null, 2)}
    
            Job Description:
            ${JSON.stringify(jobData, null, 2)}
    
            Analyze the match and return ONLY a JSON object with this exact structure:
            {
                "match_percentage": number between 0 and 100,
                "matching_skills": Array of skills found in both resume and job requirements,
                "missing_skills": Array of required skills from job not found in resume,
                "detailed_analysis": {
                    "skills_match": {
                        "matched_required_skills": Array of matched required skills,
                        "matched_preferred_skills": Array of matched preferred skills,
                        "missing_required_skills": Array of missing required skills,
                        "missing_preferred_skills": Array of missing preferred skills
                    },
                    "experience_match": Detailed analysis of experience match,
                    "education_match": Analysis of education match if relevant,
                    "recommendations": Array of specific improvements suggested
                }
            }`;
    
            const result = await model.generateContent(prompt);
            const response = await result.response;
            console.log('AI Response:', response.text());
    
            const parsedResponse = this.cleanJsonResponse(response.text());
            console.log('Parsed Analysis:', parsedResponse);
    
            // Ensure we have valid data with defaults
            return {
                match_percentage: parsedResponse.match_percentage || 0,
                matching_skills: parsedResponse.matching_skills || [],
                missing_skills: parsedResponse.missing_skills || [],
                detailed_analysis: parsedResponse.detailed_analysis || {
                    skills_match: {
                        matched_required_skills: [],
                        matched_preferred_skills: [],
                        missing_required_skills: jobData.required_skills || [],
                        missing_preferred_skills: jobData.preferred_skills || []
                    },
                    experience_match: "Analysis not available",
                    education_match: "Analysis not available",
                    recommendations: ["Detailed analysis not available"]
                }
            };
        } catch (error) {
            console.error('AI comparison error:', error);
            // Provide a basic analysis even if AI fails
            return {
                match_percentage: 0,
                matching_skills: [],
                missing_skills: jobData.required_skills || [],
                detailed_analysis: {
                    skills_match: {
                        matched_required_skills: [],
                        matched_preferred_skills: [],
                        missing_required_skills: jobData.required_skills || [],
                        missing_preferred_skills: jobData.preferred_skills || []
                    },
                    experience_match: "Analysis failed",
                    education_match: "Analysis failed",
                    recommendations: ["Please try analysis again"]
                }
            };
        }
    }    
};

module.exports = aiUtils;

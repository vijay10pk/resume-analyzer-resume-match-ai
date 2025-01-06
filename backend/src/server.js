const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const multer = require('multer');
const testRoutes = require('./routes/test.route');
const userRoutes = require('./routes/user.routes');
const resumeRoutes = require('./routes/resume.routes');
const jobDescriptionRoutes = require('./routes/jobDescription.routes')
const analysisRoutes = require('./routes/analysis.routes')

dotenv.config();

const upload = multer();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(upload.none());

// Routes
app.use('/api', testRoutes);
app.use('/api/users', userRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/jobs', jobDescriptionRoutes);
app.use('/api/analysis', analysisRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'Something broke!',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error'
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Promise Rejection:', err);
    // Close server & exit process
    server.close(() => process.exit(1));
});

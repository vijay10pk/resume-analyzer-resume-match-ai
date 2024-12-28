const express = require('express');
const router = express.Router();
const pool = require('../config/db.config');

router.get('/test', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.json({
            message: 'Database connection successful',
            timestamp: result.rows[0].now
        });
    } catch (error) {
        res.status(500).json({
            message: 'Database connection failed',
            error: error.message
        });
    }
});

module.exports = router;

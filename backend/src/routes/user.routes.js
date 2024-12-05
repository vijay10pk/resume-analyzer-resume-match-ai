const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');

// Validation middleware
const validateUser = [
    body('email')
        .isEmail()
        .withMessage('Please enter a valid email')
        .normalizeEmail(),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
        .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).*$/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

const validatePasswordUpdate = [
    body('currentPassword')
        .exists()
        .withMessage('Current password is required'),
    body('newPassword')
        .isLength({ min: 6 })
        .withMessage('New password must be at least 6 characters long')
        .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).*$/)
        .withMessage('New password must contain at least one uppercase letter, one lowercase letter, and one number')
        .custom((value, { req }) => value !== req.body.currentPassword)
        .withMessage('New password must be different from current password'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// Routes
// Register new user
router.post('/register', validateUser, userController.createUser);

// Login user
router.post('/login', [
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').exists().withMessage('Password is required')
], userController.loginUser);

// Get current user profile
router.get('/me', auth, userController.getCurrentUser);

// Update user profile
router.put('/profile', auth, [
    body('email').optional().isEmail().withMessage('Please enter a valid email'),
    body('name').optional().trim().notEmpty().withMessage('Name cannot be empty')
], userController.updateProfile);

// Update password
router.put('/password', auth, validatePasswordUpdate, userController.updatePassword);

// Delete account
router.delete('/account', auth, userController.deleteAccount);

// Get all users (admin only)
router.get('/all', auth, userController.getAllUsers);

// Get user by ID (admin only)
router.get('/:id', auth, userController.getUserById);

module.exports = router;

// src/middleware/auth.js
const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ message: 'No authentication token, authorization denied' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

module.exports = auth;
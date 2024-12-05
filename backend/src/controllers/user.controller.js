// src/controllers/user.controller.js
const dbUtils = require('../utils/db.utils');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userController = {
    // Create a new user
    createUser: async (req, res) => {
        const { email, password, name } = req.body;
        
        try {
            // Check if user already exists
            const userExists = await dbUtils.query(
                'SELECT * FROM users WHERE email = $1',
                [email]
            );

            if (userExists.rows.length > 0) {
                return res.status(400).json({ message: 'User already exists' });
            }

            // Hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            
            // Create user
            const result = await dbUtils.query(
                'INSERT INTO users (email, password_hash, name) VALUES ($1, $2, $3) RETURNING id, email, name',
                [email, hashedPassword, name]
            );

            // Generate JWT
            const token = jwt.sign(
                { id: result.rows[0].id },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );
            
            res.status(201).json({
                user: result.rows[0],
                token
            });
        } catch (error) {
            console.error('Error in createUser:', error);
            res.status(500).json({ message: 'Error creating user' });
        }
    },

    // Login user
    loginUser: async (req, res) => {
        const { email, password } = req.body;

        try {
            const result = await dbUtils.query(
                'SELECT id, email, password_hash, name FROM users WHERE email = $1',
                [email]
            );

            if (result.rows.length === 0) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            const user = result.rows[0];
            const isMatch = await bcrypt.compare(password, user.password_hash);

            if (!isMatch) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            const token = jwt.sign(
                { id: user.id },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            const { password_hash, ...userWithoutPassword } = user;
            res.json({
                user: userWithoutPassword,
                token
            });
        } catch (error) {
            console.error('Error in loginUser:', error);
            res.status(500).json({ message: 'Error during login' });
        }
    },

    // Get current user profile
    getCurrentUser: async (req, res) => {
        try {
            const result = await dbUtils.query(
                'SELECT id, email, name FROM users WHERE id = $1',
                [req.user.id]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.json(result.rows[0]);
        } catch (error) {
            console.error('Error in getCurrentUser:', error);
            res.status(500).json({ message: 'Error fetching user profile' });
        }
    },

    // Update user profile
    updateProfile: async (req, res) => {
        const { email, name } = req.body;
        
        try {
            const result = await dbUtils.query(
                'UPDATE users SET email = COALESCE($1, email), name = COALESCE($2, name), updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING id, email, name',
                [email, name, req.user.id]
            );

            res.json(result.rows[0]);
        } catch (error) {
            console.error('Error in updateProfile:', error);
            res.status(500).json({ message: 'Error updating profile' });
        }
    },

    // Update password
    updatePassword: async (req, res) => {
        const { currentPassword, newPassword } = req.body;

        try {
            const user = await dbUtils.query(
                'SELECT password_hash FROM users WHERE id = $1',
                [req.user.id]
            );

            const isMatch = await bcrypt.compare(currentPassword, user.rows[0].password_hash);

            if (!isMatch) {
                return res.status(401).json({ message: 'Current password is incorrect' });
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);

            await dbUtils.query(
                'UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
                [hashedPassword, req.user.id]
            );

            res.json({ message: 'Password updated successfully' });
        } catch (error) {
            console.error('Error in updatePassword:', error);
            res.status(500).json({ message: 'Error updating password' });
        }
    },

    // Delete account
    deleteAccount: async (req, res) => {
        try {
            await dbUtils.query(
                'DELETE FROM users WHERE id = $1',
                [req.user.id]
            );

            res.json({ message: 'Account deleted successfully' });
        } catch (error) {
            console.error('Error in deleteAccount:', error);
            res.status(500).json({ message: 'Error deleting account' });
        }
    },

    // Get all users (admin only)
    getAllUsers: async (req, res) => {
        try {
            const result = await dbUtils.query(
                'SELECT id, email, name, created_at FROM users ORDER BY created_at DESC'
            );

            res.json(result.rows);
        } catch (error) {
            console.error('Error in getAllUsers:', error);
            res.status(500).json({ message: 'Error fetching users' });
        }
    },

    // Get user by ID
    getUserById: async (req, res) => {
        try {
            const result = await dbUtils.query(
                'SELECT id, email, name, created_at FROM users WHERE id = $1',
                [req.params.id]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.json(result.rows[0]);
        } catch (error) {
            console.error('Error in getUserById:', error);
            res.status(500).json({ message: 'Error fetching user' });
        }
    }
};

module.exports = userController;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user.model');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const userController = {
    async createUser(req, res) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ error: 'Email and password are required.' });
            }

            const user = await User.create({ email, password });
            const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);

            res.status(201).json({
                message: 'User created successfully',
                user: user.toJSON(),
                token
            });
        } catch (error) {
            if (error.message === 'Email already exists') {
                return res.status(400).json({ error: error.message });
            }
            console.error('Error creating user:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    async loginUser(req, res) {
        try {
            const { email, password } = req.body;
            console.log(email + ":" + password);

            if (!email || !password) {
                return res.status(400).json({ error: 'Email and password are required.' });
            }

            const user = await User.findByEmail(email);
            if (!user) {
                return res.status(401).json({ error: 'Invalid email or password.' });
            }

            const validPassword = await bcrypt.compare(password, user.password_hash);
            if (!validPassword) {
                return res.status(401).json({ error: 'Invalid email or password.' });
            }

            const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);

            res.json({
                message: 'Login successful',
                user: user.toJSON(),
                token
            });
        } catch (error) {
            console.error('Error logging in:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    async getCurrentUser(req, res) {
        try {
            const user = await User.findById(req.user.id);
            if (!user) {
                return res.status(404).json({ error: 'User not found.' });
            }

            res.json({ user: user.toJSON() });
        } catch (error) {
            console.error('Error fetching user:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    async updatePassword(req, res) {
        try {
            const { currentPassword, newPassword } = req.body;

            if (!currentPassword || !newPassword) {
                return res.status(400).json({ error: 'Current password and new password are required.' });
            }

            const user = await User.findById(req.user.id);
            if (!user) {
                return res.status(404).json({ error: 'User not found.' });
            }

            await user.updatePassword(currentPassword, newPassword);
            res.json({ message: 'Password updated successfully' });
        } catch (error) {
            if (error.message === 'Current password is incorrect') {
                return res.status(401).json({ error: error.message });
            }
            console.error('Error updating password:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }, 

    async getAllUsers(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const offset = (page - 1) * limit;

            const users = await User.findAll(limit, offset);
            
            res.json({
                users: users.map(user => user.toJSON()),
                pagination: {
                    page,
                    limit,
                    offset
                }
            });
        } catch (error) {
            console.error('Error fetching users:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    async getUserById(req, res) {
        try {
            const user = await User.findById(req.params.id);
            
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            res.json({ user: user.toJSON() });
        } catch (error) {
            console.error('Error fetching user:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    async updateProfile(req, res) {
        try {
            const user = await User.findById(req.user.id);
            
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            const updatedUser = await user.updateProfile(req.body);
            res.json({
                message: 'Profile updated successfully',
                user: updatedUser.toJSON()
            });
        } catch (error) {
            if (error.message === 'Email already exists') {
                return res.status(400).json({ error: error.message });
            }
            console.error('Error updating profile:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    async deleteAccount(req, res) {
        try {
            const user = await User.findById(req.user.id);
            
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            // Optionally verify password before deletion
            const { password } = req.body;
            if (password) {
                const validPassword = await bcrypt.compare(password, user.password_hash);
                if (!validPassword) {
                    return res.status(401).json({ error: 'Invalid password' });
                }
            }

            await user.delete();
            res.json({ message: 'Account deleted successfully' });
        } catch (error) {
            console.error('Error deleting account:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
};

module.exports = userController;

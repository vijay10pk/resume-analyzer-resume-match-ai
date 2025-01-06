const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');

// Public routes
router.post('/register', userController.createUser);
router.post('/login', userController.loginUser);

// Admin routes
router.get('/', authenticateToken, userController.getAllUsers);


// Protected user routes
router.get('/me', authenticateToken, userController.getCurrentUser);
router.put('/me', authenticateToken, userController.updateProfile);
router.put('/password', authenticateToken, userController.updatePassword);
router.delete('/me', authenticateToken, userController.deleteAccount);
router.get('/:id', authenticateToken, userController.getUserById);

module.exports = router;

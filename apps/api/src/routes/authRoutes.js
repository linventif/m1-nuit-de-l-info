import express from 'express';
<<<<<<< HEAD
import { register, login, getCurrentUser } from '../controllers/authController.js';
=======
import { register, login, logout, getCurrentUser } from '../controllers/authController.js';
>>>>>>> origin/main
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', register);

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login', login);

/**
<<<<<<< HEAD
=======
 * @route   POST /api/auth/logout
 * @desc    Logout user
 * @access  Public
 */
router.post('/logout', authenticateToken, logout);

/**
>>>>>>> origin/main
 * @route   GET /api/auth/me
 * @desc    Get current user
 * @access  Private
 */
router.get('/me', authenticateToken, getCurrentUser);

export default router;


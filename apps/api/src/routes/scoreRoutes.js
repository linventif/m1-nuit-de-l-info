import express from 'express';
import {
  getAllscores,
  getScoreByUserId,
  setScorebyUserId,
} from '../controllers/scoreController.js';

const router = express.Router();

/**
 * @route   GET /api/scores
 * @desc    Get all scores
 * @access  Public
 */
router.get('/', getAllscores);

/**
 * @route   GET /api/scores/:id
 * @desc    Get score by ID
 * @access  Public
 */
router.get('/:id', getScoreByUserId);

/**
 * @route   POST /api/scores/:id
 * @desc    Update or create score for a user
 * @access  Public
 */
router.post('/:id', setScorebyUserId);

export default router;


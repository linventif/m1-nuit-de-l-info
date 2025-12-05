import express from 'express';
import {
  getAllscores,
  getScoreByUserId,
  addScorebyUserId,
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
 * @route   POST /api/scores
 * @desc    Create a new score
 * @access  Public
 */
router.post('/:id', addScorebyUserId);



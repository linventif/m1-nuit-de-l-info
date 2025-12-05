import Score from '../models/Score.js';

/**
 * Get all scores
 */
export const getAllscores = async (req, res) => {
  try {
    const scores = await Score.findAll({
      attributes: ['id', 'user_id', 'score', 'game_type', 'createdAt', 'updatedAt'],
    });
    res.json(scores);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get scores by user ID
 */
export const getScoreByUserId = async (req, res) => {
  try {
    const scores = await Score.findAll({
      where: { user_id: req.params.id },
      attributes: ['id', 'user_id', 'score', 'game_type', 'createdAt', 'updatedAt'],
      order: [['score', 'DESC']],
    });

    res.json(scores);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Add score by user ID
 */
export const addScorebyUserId = async (req, res) => {
  try {
    const { score, game_type } = req.body;
    const user_id = req.params.id;

    if (!score || !game_type) {
      return res.status(400).json({ error: 'score and game_type are required' });
    }

    if (!['snake', 'laser'].includes(game_type)) {
      return res.status(400).json({ error: 'game_type must be either "snake" or "laser"' });
    }

    if (score < 0) {
      return res.status(400).json({ error: 'score must be greater than or equal to 0' });
    }

    const newScore = await Score.create({ user_id, score, game_type });
    res.status(201).json(newScore);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
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
 * Update or create score by user ID and game type
 */
export const setScorebyUserId = async (req, res) => {
  try {
    const { score, game_type } = req.body;
    const user_id = req.params.id;

    if (!score || !game_type) {
      return res.status(400).json({ error: 'score and game_type are required' });
    }

    if (!['snake_classic', 'snake_obstacles', 'absolute_snake', 'laser', 'quizz'].includes(game_type)) {
      return res.status(400).json({ error: 'game_type must be one of: snake_classic, snake_obstacles, absolute_snake, laser, quizz' });
    }

    if (score < 0) {
      return res.status(400).json({ error: 'score must be greater than or equal to 0' });
    }

    // Chercher un score existant pour cet utilisateur et ce type de jeu
    const existingScore = await Score.findOne({
      where: {
        user_id: user_id,
        game_type: game_type,
      },
    });

    let result;
    if (existingScore) {
      // Mettre à jour le score existant seulement si le nouveau score est supérieur
      if (score > existingScore.score) {
        await existingScore.update({ score });
        result = existingScore;
      } else {
        // Le score actuel est meilleur, retourner celui-ci
        result = existingScore;
      }
    } else {
      // Créer un nouveau score si aucun n'existe
      result = await Score.create({ user_id, score, game_type });
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import User from './User.js';

export const Score = sequelize.define(
  'Score',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
      validate: {
        notEmpty: true,
      },
    },
    score: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: false,
      validate: {
        min: 0,
      },
    },
    game_type: {
      type: DataTypes.ENUM('snake_classic', 'snake_obstacles', 'absolute_snake', 'laser', 'quizz'),
      allowNull: false,
      unique: false,
    },
  },
  {
    tableName: 'scores',
    timestamps: true,
  }
);

// Define relationships
Score.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user',
});

User.hasMany(Score, {
  foreignKey: 'user_id',
  as: 'scores',
});

export default Score;

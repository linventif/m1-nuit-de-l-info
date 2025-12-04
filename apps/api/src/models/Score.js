import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

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
      type: DataTypes.ENUM('snake', 'laser'),
      allowNull: false,
      unique: false,
    },
  },
  {
    tableName: 'scores',
    timestamps: true,
  }
);

export default Score;

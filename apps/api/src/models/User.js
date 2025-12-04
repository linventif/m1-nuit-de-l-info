import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

export const User = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    pseudo: {
      type: DataTypes.STRING,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
    },
    score: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    pattern: {
      type: DataTypes.STRING,
    salt: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
      validate: {
        notEmpty: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
      validate: {
        len: [60, 60],
      },
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: 'user',
      validate: {
        isIn: [['user', 'admin', 'moderator']],
      },
    },
  },
  {
    tableName: 'users',
    timestamps: true,
  }
);

export default User;

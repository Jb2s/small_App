const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TodoList = sequelize.define('TodoList', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = TodoList;

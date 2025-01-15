const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class SubTask extends Model {}

SubTask.init({
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  completed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  taskId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'tasks', 
      key: 'id',
    },
  },
}, {
  sequelize,
  modelName: 'SubTask',
  tableName: 'sub_tasks',
  timestamps: false,
});

module.exports = SubTask;
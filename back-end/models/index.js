const sequelize = require('../config/database');
const User = require('./User');
const Task = require('./Task');
const SubTask = require('./Subtask');

User.hasMany(Task, { foreignKey: 'userId', as: 'tasks' });
Task.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Task.hasMany(SubTask, { foreignKey: 'taskId', as: 'subTasks' });
SubTask.belongsTo(Task, { foreignKey: 'taskId', as: 'task' });

module.exports = {
  sequelize,
  User,
  Task,
  SubTask,
};
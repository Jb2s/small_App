const sequelize = require('../config/database');
const User = require('./User');
const Task = require('./Task');
const SubTask = require('./Subtask');
const Comment = require('./Comment')

User.hasMany(Task, { foreignKey: 'userId', as: 'tasks', onDelete: 'CASCADE' });
Task.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Task.hasMany(SubTask, { foreignKey: 'taskId', as: 'subTasks', onDelete: 'CASCADE' });
SubTask.belongsTo(Task, { foreignKey: 'taskId', as: 'task' });

User.hasMany(Comment, { foreignKey: 'userId', as: 'comments', onDelete: 'CASCADE' });
Comment.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Task.hasMany(Comment, { foreignKey: 'taskId', as: 'comments', onDelete: 'CASCADE' });
Comment.belongsTo(Task, { foreignKey: 'taskId', as: 'task' });

module.exports = {
  sequelize,
  User,
  Task,
  SubTask,
  Comment,
};

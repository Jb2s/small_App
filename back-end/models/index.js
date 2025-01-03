const sequelize = require('../config/database');
const User = require('./user');
const TodoList = require('./todolist');

// Définir les relations
User.hasMany(TodoList, { foreignKey: 'userId' });
TodoList.belongsTo(User, { foreignKey: 'userId' });

module.exports = {
  sequelize,
  User,
  TodoList,
};

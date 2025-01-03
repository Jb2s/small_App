const express = require('express');
const app = express();
const port = 3000;

const { sequelize, User, TodoList } = require('./models');

app.use(express.json());

sequelize.sync({alter: true})
  .then(() => {
    console.log('Database synchronized');
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error('Error synchronizing database:', error);
  });

const express = require('express');
const app = express();
const port = 3000;

const { sequelize, User, Task, SubTask } = require('./models');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes'); 
const authenticate = require('./middlewares/authMiddleware');

app.get('/', (req, res) => {
  res.send('Bienvenue sur l\'API !');
});
app.post('/', (req, res) => {
  res.send('Requête POST reçue à la racine !');
});

app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/tasks', authenticate, taskRoutes); 


sequelize.sync()
  .then(() => {
    console.log('Database synchronized');
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error('Error synchronizing database:', error);
  });
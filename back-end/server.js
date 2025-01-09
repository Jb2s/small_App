require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT;

const corsOptions = {
  origin: process.env.URL_FRONT_ORIGIN,
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  allowedHeaders: ['Content-Type', 'Authorization'], 
};

const { sequelize, User, Task, SubTask } = require('./models');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');
const subtaskRoutes = require('./routes/subtaskRoutes'); 
const authenticate = require('./middlewares/authMiddleware');


app.get('/', (req, res) => {
  res.send('Bienvenue sur l\'API !');
});
app.post('/', (req, res) => {
  res.send('Requête POST reçue à la racine !');
});
app.put('/', (req, res) => {
  res.send('Requête PUT reçue à la racine !');
});
app.delete('/', (req, res) => {
  res.send('Requête DELETE reçue à la racine !');
});

app.use(bodyParser.json());
app.use(express.json());
app.use(cors(corsOptions));
app.use('/api/users', userRoutes);
app.use('/api/tasks', authenticate, taskRoutes); 
app.use('/api/subtasks', authenticate, subtaskRoutes); 

sequelize.sync()
  .then(() => {
    console.log('Database synchronized');
    app.listen(port, () => {
      console.log(`Server is running on ${process.env.URL_API}`);
    });
  })
  .catch((error) => {
    console.error('Error synchronizing database:', error);
  });
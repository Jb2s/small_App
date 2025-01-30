require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const bodyParser = require('body-parser');

const { sequelize, User, Task, SubTask, Comment } = require('./models');
const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');
const subtaskRoutes = require('./routes/subtaskRoutes');
const authenticate = require('./middlewares/authMiddleware');


const app = express();
const server = http.createServer(app); 
const io = new Server(server, {
  cors: {
    origin: process.env.URL_FRONT_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
  },
});

const port = process.env.PORT;

const corsOptions = {
  origin: process.env.URL_FRONT_ORIGIN,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
};

app.use(bodyParser.json());
app.use(express.json());
app.use(cors(corsOptions));

app.use('/api/users', userRoutes);
app.use('/api/tasks', authenticate, taskRoutes);
app.use('/api/subtasks', authenticate, subtaskRoutes);

io.on("connection", (socket) => {
  console.log("user connected");
  socket.on('newComment', (data) => {
    console.log('Nouveau commentaire reçu:', data);
    
    io.emit('newComment', data);
  });
});

sequelize
  .sync()
  .then(() => {
    console.log('Base de données synchronisée');
    server.listen(port, () => {
      console.log(`Serveur en cours d'exécution sur ${process.env.URL_API}`);
    });
  })
  .catch((error) => {
    console.error('Erreur de synchronisation de la base de données :', error);
  });

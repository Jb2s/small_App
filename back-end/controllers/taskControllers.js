const Task = require('../models/Task'); 
const Subtask = require('../models/Subtask'); 

const addUserTask = async (req, res) => {
  const { title, description, completed } = req.body;
  const userId = req.user.id; 

  try {
    const newTask = await Task.create({
      title,
      description,
      completed,
      userId,
    });

    res.status(201).json(newTask); 
  } 
  catch (error) 
  {
    console.error('Erreur lors de l\'ajout de la tâche:', error);
    res.status(500).json({ 
      message: 'Erreur interne du serveur.', 
      isError: true,
      code: 'S000' });
  }
};

const getUserTasks = async (req, res) => {
  try {
    const userId = req.user.id; 
    const tasks = await Task.findAll({
      where: { userId: userId } 
    });

    if (tasks.length === 0) {
      return res.status(404).json({ 
        message: 'Aucune tâche trouvée.', 
        isError: true,
        code: 'UT000' });
    }

    res.status(200).json(tasks);
  } 
  catch (error) 
  {
    console.error('Erreur lors de la récupération des tâches:', error);
    res.status(500).json({ 
      message: 'Erreur interne du serveur.', 
      isError: true,
      code: 'S000' });
  }
};

const getTaskDetails = async (req, res) => {
  const taskId = req.params.taskid; 
  const userId = req.user.id; 

  try {
    
    const task = await Task.findOne({
      where: {
        id: taskId,
        userId: userId, 
      },
    });

    if (!task) {
      return res.status(404).json({ 
        message: 'Tâche non trouvée.', 
        isError: true,
        code: 'UT000' }); 
    }

    res.status(200).json(task); 
  } 
  catch (error) 
  {
    console.error('Erreur lors de la récupération de la tâche:', error);
    res.status(500).json({ 
      message: 'Erreur interne du serveur.', 
      isError: true,
      code: 'S000' }); 
  }
};

const updateUserTask = async (req, res) => {
  const taskId = req.params.taskid;
  const userId = req.user.id; 
  const { title, description, completed } = req.body; 

  try {
    
    const task = await Task.findOne({
      where: {
        id: taskId,
        userId: userId, 
      },
    });

    if (!task) {
      return res.status(404).json({ 
        message: 'Tâche non trouvée.', 
        isError: true,
        code: 'UT000' });
    }

    await task.update({
      title,
      description,
      completed,
    });

    res.status(200).json(task); 
  } 
  catch (error) 
  {
    console.error('Erreur lors de la mise à jour de la tâche:', error);
    res.status(500).json({ 
      message: 'Erreur interne du serveur.', 
      isError: true,
      code: 'S000' }); 
  }
};

const deleteUserTask = async (req, res) => {
  const taskId = req.params.taskid; 
  const userId = req.user.id; 

  try {
      const task = await Task.findOne({
          where: {
              id: taskId,
              userId: userId, 
          },
          include: [{
              model: SubTask, 
              as: 'subTasks', 
          }],
      });

      if (!task) {
          return res.status(404).json({ 
              message: 'Tâche non trouvée.',
              isError: true,
              code: 'UT000' 
          });
      }

      await Subtask.destroy({
          where: {
              parentId: taskId, 
          },
      });

      await task.destroy(); 

      res.status(204).send(); 
  } 
  catch (error) 
  {
      console.error('Erreur lors de la suppression de la tâche:', error);
      res.status(500).json({ 
          message: 'Erreur interne du serveur.', 
          isError: true,
          code: 'S000' 
      }); 
  }
};

module.exports = {
  getUserTasks,
  addUserTask,
  getTaskDetails,
  updateUserTask,
  deleteUserTask,
};
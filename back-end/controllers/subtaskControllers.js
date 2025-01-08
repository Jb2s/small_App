const SubTask = require('../models/Subtask'); 
const Task = require('../models/Task');

const addSubTaskToTask = async (req, res) => {
  const taskId = req.params.taskId; 
  const userId = req.user.id; 
  const { title } = req.body; 

  try {
    const task = await Task.findOne({
      where: {
        id: taskId,
        userId: userId, 
      },
    });

    if (!task) {
      return res.status(404).json({ message: 'Tâche non trouvée.' });
    }

    const subTask = await SubTask.create({
      title,
      taskId, 
    });

    res.status(201).json(subTask); 
  } 
  catch (error) 
  {
    console.error('Erreur lors de l\'ajout de la sous-tâche:', error);
    res.status(500).json({ message: 'Erreur interne du serveur.' }); 
  }
};

const getSubTasksByTaskId = async (req, res) => {
    const taskId = req.params.taskId; 
    const userId = req.user.id; 
  
    try {
      const task = await Task.findOne({
        where: {
          id: taskId,
          userId: userId, 
        },
      });
  
      if (!task) {
        return res.status(404).json({ message: 'Tâche non trouvée.' });
      }
  
      const subTasks = await SubTask.findAll({
        where: {
          taskId: taskId, 
        },
      });
  
      res.status(200).json(subTasks); 
    } 
    catch (error) 
    {
      console.error('Erreur lors de la récupération des sous-tâches:', error);
      res.status(500).json({ message: 'Erreur interne du serveur.' }); 
    }
  };

  const updateSubTaskByTaskId = async (req, res) => {
    const subTaskId = req.params.subtaskId;
    const taskId = req.params.taskId;
    const userId = req.user.id;
    const { title } = req.body;
    
    try {
      const subTask = await SubTask.findOne({
        where: {
          id: subTaskId,
        },
      });
  
      if (!subTask) {
        return res.status(404).json({ message: 'Sous-tâche non trouvée.' });
      }
  
      const task = await Task.findOne({
        where: {
          id: taskId,
          userId: userId,
        },
      });
  
      if (!task) {
        return res.status(403).json({ message: 'Accès non autorisé à cette sous-tâche.' });
      }
  
      if (subTask.taskId !== Number(taskId)) { 
        return res.status(400).json({ message: 'La sous-tâche n\'appartient pas à cette tâche.' });
      }
  
      await subTask.update({
        title,
      });
  
      res.status(200).json(subTask);
    } 
    catch (error) 
    {
      console.error('Erreur lors de la mise à jour de la sous-tâche:', error);
      res.status(500).json({ message: 'Erreur interne du serveur.' });
    }
  };
  

  const deleteSubTaskByTaskId = async (req, res) => {
    const subTaskId = req.params.subtaskId; 
    const taskId = req.params.taskId; 
    const userId = req.user.id;
  
    try {
      const subTask = await SubTask.findOne({
        where: {
          id: subTaskId,
        },
      });
  
      if (!subTask) {
        return res.status(404).json({ message: 'Sous-tâche non trouvée.' });
      }
  
      const task = await Task.findOne({
        where: {
          id: taskId,
          userId: userId, 
        },
      });
  
      if (!task) {
        return res.status(403).json({ message: 'Accès non autorisé à cette sous-tâche.' });
      }
  
      if (subTask.taskId !== Number(taskId)) {
        return res.status(400).json({ message: 'La sous-tâche n\'appartient pas à cette tâche.' });
      }
  
      await subTask.destroy();
  
      res.status(204).send(); 
    } 
    catch (error) 
    {
      console.error('Erreur lors de la suppression de la sous-tâche:', error);
      res.status(500).json({ message: 'Erreur interne du serveur.' }); 
    }
  };

module.exports = {
    addSubTaskToTask,
    getSubTasksByTaskId,
    updateSubTaskByTaskId,
    deleteSubTaskByTaskId,
};

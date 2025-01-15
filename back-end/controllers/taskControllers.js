const Task = require('../models/Task'); 
const Subtask = require('../models/Subtask'); 
const sequelize = require('../config/database');


const addUserTask = async (req, res) => {
  const { title, description, completed, subtasks } = req.body; 
  const userId = req.user.id; 

  const transaction = await sequelize.transaction();

  try {
    const newTask = await Task.create(
      {
        title,
        description,
        completed,
        userId,
      },
      { transaction }
    );

    if (subtasks && Array.isArray(subtasks) && subtasks.length) {
      const subTasks = subtasks
        .filter(subtask => subtask.title) 
        .map(subtask => ({
          title: subtask.title,
          taskId: newTask.id, 
        }));
    
      if (subTasks.length) {
        await Subtask.bulkCreate(subTasks, { transaction });
      }
    }

    await transaction.commit();

    res.status(201).json(newTask); 
  } catch (error) {
    await transaction.rollback();
    console.error('Erreur lors de l\'ajout de la tâche:', error);
    res.status(500).json({ 
      message: 'Erreur interne du serveur.',
    isError: true,
    code: 'S000' });
  }
};

const getUserTasks = async (req, res) => {
  const userId = req.user.id;

  try {
    const tasks = await Task.findAll({ where: { userId } });

    if (tasks.length === 0) {
      return res.status(404).json({
        message: 'Aucune tâche trouvée.',
        isError: true,
        code: 'UT000'
      });
    }

    const tasksWithSubtasks = await Promise.all(
      tasks.map(async (task) => {
        const subtasks = await Subtask.findAll({ where: { taskId: task.id } });
        return { ...task.toJSON(), subtasks }; 
      })
    );

    res.status(200).json(tasksWithSubtasks);
  } catch (error) {
    console.error('Erreur lors de la récupération des tâches:', error);
    res.status(500).json({
      message: 'Erreur interne du serveur.',
      isError: true,
      code: 'S000'
    });
  }
};


const toggleTask = async (req, res) => {
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
      return res.status(404).json({
        message: 'Tâche non trouvée.',
        isError: true,
        code: 'UT000'
      });
    }

    const previousState = task.completed;
    task.completed = !previousState;

    const subTasks = await Subtask.findAll({
      where: {
        taskId: taskId,
      },
    });

    if (task.completed) {
      await Promise.all(subTasks.map(subTask => {
        subTask.completed = true;
        return subTask.save();
      }));
    } else {
      await Promise.all(subTasks.map(subTask => {
        subTask.completed = false;
        return subTask.save();
      }));
    }

    await task.save();

    res.status(200).json({ task, subTasks });
    
  } catch (error) {
    console.error('Erreur lors du basculement de la tâche:', error);
    res.status(500).json({ 
      message: 'Erreur interne du serveur.',
      isError: true,
      code: 'S000' 
    });
  }
};




const getTaskDetails = async (req, res) => {
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
  const taskId = req.params.taskId; 
  const userId = req.user.id;
  const { title, description, completed, subtasks } = req.body;
  console.log('req.body', req.body);

  const transaction = await sequelize.transaction();

  try {
    const task = await Task.findOne({ 
      where: {
        id: taskId,
        userId: userId 
        } 
    });

    if (!task) {
      console.log('task not found');
      return res.status(404).json({ 
        message: 'Tâche non trouvée.', 
        isError: true,
        code: 'UT000' });
    }

    task.title = title ? title : task.title;
    task.description = description ? description : task.description;
    task.completed = completed ? completed : task.completed;

    await task.save({ transaction });
    
    
    let todoList = []
    if (subtasks && Array.isArray(subtasks)) {
      for (const subtask of subtasks) {
        let _todo = await Subtask.findByPk(subtask.id);
        if (subtask.id) {
          if (_todo) {
            _todo.title = subtask.title !== undefined ? subtask.title : _todo.title;
            await _todo.save({ transaction });
          }
        } else {
          await Subtask.create({
            title: subtask.title,
            taskId: task.id,
          }, { transaction });
        }
        todoList.push(_todo); 
      } 
      
      // const existingSubtaskIds = task.subtasks.map(subtask => subtask.id);

      

      // const subtaskIdsToDelete = existingSubtaskIds.filter(id => !subtasks.some(subtask => subtask.id === id));
      // if (subtaskIdsToDelete.length) {
      //   await Subtask.destroy({ where: { id: subtaskIdsToDelete }, transaction });
      // }
    }

    await transaction.commit();
    res.status(200).json(task); 
  } catch (error) {
    await transaction.rollback();
    console.error('Erreur lors de la mise à jour de la tâche:', error);
    res.status(500).json({ 
      message: 'Erreur interne du serveur.',
      isError: true,
      code: 'S001' 
    });
  }
};

const deleteUserTask = async (req, res) => {
  const taskId = req.params.taskId; 
  const userId = req.user.id; 

  try {
      const task = await Task.findOne({
          where: {
              id: taskId,
              userId: userId, 
          }    
      });

      if (!task) {
          return res.status(404).json({ 
              message: 'Tâche non trouvée.',
              isError: true,
              code: 'UT000' 
          });
      }
      await task.destroy(); 

      res.status(204).send( { message: 'Tâche supprimée avec succès.'});
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
  toggleTask,
};
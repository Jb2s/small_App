const User = require('../models/User');
const Task = require('../models/Task'); 
const Subtask = require('../models/Subtask');
const Comment = require('../models/Comment');
const sequelize = require('../config/database');

const addUserTask = async (req, res) => {
  const { title, description, completed, subTasks } = req.body;
  const userId = req.user.id;
  const transaction = await sequelize.transaction();
  console.log(' recevie from front end', subTasks)
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
    let createdSubtask = []; 
    
    if (subTasks && Array.isArray(subTasks) && subTasks.length) {
      const _subTasks = subTasks
        .filter((sb) => sb.title) 
        .map((sb2) => ({
          title: sb2.title,
          taskId: newTask.id, 
        }));
        console.log('subTasks in progress', _subTasks)
      if (_subTasks) {
        createdSubtask = await Subtask.bulkCreate(_subTasks, { transaction });
      }
      console.log('createdSubtask success', createdSubtask)
    }
    

    await transaction.commit();
    res.status(201).json({
      task: newTask,
      subTasks: createdSubtask.length ? createdSubtask : undefined, 
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Erreur lors de l'ajout de la tâche:", error);
    res.status(500).json({
      message: "Erreur interne du serveur.",
      isError: true,
      code: "S000"
    });
  }
};


const addCommentToTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { userId, content } = req.body;

    const task = await Task.findByPk(taskId);
    if (!task) {
      return res.status(404).json({ 
        message: 'Tâche non trouvée',
        isError: true,
        code: 'UT000' 
      });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ 
        message: "Utilisateur non trouvé",
        isError: true,
        code: 'U010' 
      });
    }

    const comment = await Comment.create({
      taskId,
      userId,
      content,
    });

    res.status(201).json({ message: 'Commentaire ajouté avec succès', comment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};

module.exports = {
  addCommentToTask,
};


const  getCommentsToTask = async (req, res) =>{
  const { taskId } = req.params; 
  const tId = parseInt(taskId, 10);
  try {
    const task = await Task.findByPk(tId, {
      include: [
        {
          model: Comment,
          as: 'comments', 
          include: [
            {
              model: User,
              as: 'user', 
              attributes: ['id', 'username'], 
            },
          ],
        },
      ],
    });
    if (!task) {
      return res.status(404).json({ 
        message: 'Aucune tâche trouvée.',
        isError: true,
        code: 'UT000'
       });
    }
    res.json({ task });
  } catch (error) {
    console.error('Erreur lors de la récupération des commentaires:', error);
    res.status(500).json({ 
      message: "Erreur interne du serveur.",
      isError: true,
      code: "S000"
    });
  }
};


const getSharedTasks = async (req, res) => {
  try {
    const sharedTasks = await Task.findAll({
      where: { isShared: true }, 
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['username'], 
        },
        {
          model: Subtask,
          as: 'subTasks', 
          attributes: ['id', 'title','completed'], 
        },
      ],
    });
    if (sharedTasks.length === 0) {
      return res.status(404).json({
        message: 'Aucune tache trouvée.',
        isError: true,
        code: 'UT000'
      });
    }
    res.status(200).json( { sharedTasks} );
  } catch (error) {
    console.error('Erreur lors de la récupération des tâches partagées :', error);
    res.status(500).json({ 
      message: "Erreur interne du serveur.",
      isError: true,
      code: "S000"
     });
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
        const subTasks = await Subtask.findAll({ where: { taskId: task.id } });
        return { ...task.toJSON(), subTasks }; 
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

const toggleSharedTask = async(req, res) => {
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

    task.isShared = true;
    await task.save();

    res.status(200).json( task );
    
  } catch (error) {
    console.error('Erreur lors du partage de la tâche:', error);
    res.status(500).json({ 
      message: 'Erreur interne du serveur.',
      isError: true,
      code: 'S000' 
    });
  }

}

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
        userId: userId,
      },
      transaction, 
    });

    if (!task) {
      console.log('Tâche non trouvée');
      await transaction.rollback();
      return res.status(404).json({
        message: 'Tâche non trouvée.',
        isError: true,
        code: 'UT000',
      });
    }

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (completed !== undefined) task.completed = completed;
    if (completed !== undefined) task.completed = completed;

    await task.save({ transaction });

    const todoList = [];
    if (subtasks && Array.isArray(subtasks)) {
      for (const subtask of subtasks) {
        if (subtask.id) {
          const existingSubtask = await Subtask.findByPk(subtask.id, { transaction });
          if (existingSubtask) {
            if (subtask.title !== undefined) existingSubtask.title = subtask.title;
            await existingSubtask.save({ transaction });
            todoList.push(existingSubtask);
          }
        } else {
          const newSubtask = await Subtask.create(
            {
              title: subtask.title,
              taskId: task.id,
            },
            { transaction }
          );
          todoList.push(newSubtask);
        }
      }
    }

    await transaction.commit();

    res.status(200).json({ task, todoList });
  } catch (error) {
    await transaction.rollback();
    console.error('Erreur lors de la mise à jour de la tâche:', error);
    res.status(500).json({
      message: 'Erreur interne du serveur.',
      isError: true,
      code: 'S001',
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
  getSharedTasks ,
  toggleSharedTask,
  addCommentToTask,
  getCommentsToTask,
};
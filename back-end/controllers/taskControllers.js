const Task = require('../models/Task'); 


const getUserTasks = async (req, res) => {
  try {
    const userId = req.user.id; 
    const tasks = await Task.findAll({
      where: { userId: userId } 
    });

    if (tasks.length === 0) {
      return res.status(404).json({ message: 'Aucune tâche trouvée.' });
    }

    res.status(200).json(tasks);
  } catch (error) {
    console.error('Erreur lors de la récupération des tâches:', error);
    res.status(500).json({ message: 'Erreur interne du serveur.' });
  }
};

module.exports = {
  getUserTasks,
};
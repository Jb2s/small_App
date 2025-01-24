const express = require('express');
const router = express.Router();

const { 
    getUserTasks, 
    addUserTask, 
    getTaskDetails,
    updateUserTask,
    deleteUserTask,
    toggleTask,
    getSharedTasks,
    toggleSharedTask, 

} = require('../controllers/taskControllers');

router.get('/getTasks', getUserTasks);
router.get('/getSharedTasks', getSharedTasks);
router.put('/:taskId/toggleSharedTask', toggleSharedTask);
router.post('/addTask', addUserTask);
router.put('/:taskId/toggle', toggleTask);
router.get('/getTaskDetails/:taskId', getTaskDetails);
router.put('/updateTask/:taskId', updateUserTask);
router.delete('/deleteTask/:taskId', deleteUserTask);
 

module.exports = router;
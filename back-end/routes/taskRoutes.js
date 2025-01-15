const express = require('express');
const router = express.Router();

const { 
    getUserTasks, 
    addUserTask, 
    getTaskDetails,
    updateUserTask,
    deleteUserTask,
    toggleTask, 

} = require('../controllers/taskControllers');

router.get('/getTasks', getUserTasks);
router.post('/addTask', addUserTask);
router.put('/:taskId/toggle', toggleTask);
router.get('/getTaskDetails/:taskId', getTaskDetails);
router.put('/updateTask/:taskId', updateUserTask);
router.delete('/deleteTask/:taskId', deleteUserTask);
 

module.exports = router;
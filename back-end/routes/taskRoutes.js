const express = require('express');
const router = express.Router();

const { 
    getUserTasks, 
    addUserTask, 
    getTaskDetails,
    updateUserTask,
    deleteUserTask,
    toggleTask,
    getSharedTasksOthers,
    toggleSharedTask,
    addCommentToTask,
    getCommentsToTask, 

} = require('../controllers/taskControllers');

router.get('/getTasks', getUserTasks);
router.get('/:taskId/getCommentsToTask/', getCommentsToTask);
router.get('/getSharedTasks', getSharedTasksOthers);
router.put('/:taskId/toggleSharedTask', toggleSharedTask);
router.post('/addTask', addUserTask);
router.post('/:taskId/addComment/', addCommentToTask);
router.put('/:taskId/toggle', toggleTask);
router.get('/getTaskDetails/:taskId', getTaskDetails);
router.put('/updateTask/:taskId', updateUserTask);
router.delete('/deleteTask/:taskId', deleteUserTask);
 

module.exports = router;
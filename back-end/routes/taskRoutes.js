const express = require('express');
const router = express.Router();

const { 
    getUserTasks, 
    addUserTask, 
    getTaskDetails,
    updateUserTask,
    deleteUserTask, 

} = require('../controllers/taskControllers');

router.get('/', getUserTasks);
router.post('/addTask', addUserTask); 
router.get('/getTaskDetails/:taskid', getTaskDetails);
router.put('/updateTask/:taskid', updateUserTask);
router.delete('/deleteTask/:taskid', deleteUserTask);
 

module.exports = router;
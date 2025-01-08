const express = require('express');
const router = express.Router();

const { 
    addSubTaskToTask, 
    getSubTasksByTaskId,
    updateSubTaskByTaskId,
    deleteSubTaskByTaskId,
} = require('../controllers/subtaskControllers');


router.post('/:taskid/addSubtasks', addSubTaskToTask); 
router.get('/:taskId/getSubtasks', getSubTasksByTaskId); 
router.put('/:taskId/updateSubtasks/:subtaskId', updateSubTaskByTaskId); 
router.delete('/:taskId/deleteSubtasks/:subtaskId', deleteSubTaskByTaskId); 


module.exports = router;
const express = require('express');
const router = express.Router();
const { getUserTasks } = require('../controllers/taskControllers');

router.get('/', getUserTasks);

module.exports = router;
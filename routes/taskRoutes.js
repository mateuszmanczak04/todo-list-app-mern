const express = require('express');

const {
  getUserTasks,
  createTask,
  deleteTask,
} = require('../controllers/taskController');
const router = express.Router();

router.get('/:userToken', getUserTasks);

router.post('/', createTask);

router.delete('/:taskId', deleteTask);

module.exports = router;

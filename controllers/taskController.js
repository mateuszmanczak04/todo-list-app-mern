const Task = require('../models/taskModel');
const jwt = require('jsonwebtoken');

const getUserTasks = async (req, res) => {
  const { userToken } = req.params;

  try {
    if (!userToken) {
      throw Error('No authorized');
    }

    jwt.verify(userToken, process.env.SECRET, async (err, decodedToken) => {
      if (err) {
        throw Error('There was a problem');
      }
      const tasks = await Task.find({ userId: decodedToken._id }).select(
        '-userId'
      );

      res.status(200).json({ tasks });
    });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

const createTask = async (req, res) => {
  const { title, date, important, token } = req.body;

  try {
    if (!title) {
      throw Error('You must provide a task title');
    }

    jwt.verify(token, process.env.SECRET, async (err, decodedToken) => {
      const { _id } = decodedToken;

      const task = await new Task({
        title,
        date,
        important,
        userId: _id,
      }).save();

      res.status(200).json({ task });
    });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
};

const deleteTask = async (req, res) => {
  const { taskId } = req.params;

  try {
    await Task.deleteOne({ _id: taskId });

    res.sendStatus(200);
  } catch (error) {
    res.status(400).send({ error: err.message });
  }
};

module.exports = { getUserTasks, createTask, deleteTask };

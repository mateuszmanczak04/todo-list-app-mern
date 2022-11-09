const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
  },
  important: {
    type: Boolean,
  },
  userId: {
    type: mongoose.ObjectId,
    required: true,
  },
});

module.exports = mongoose.model('Task', taskSchema);

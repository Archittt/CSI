const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const auth = require('../middleware/auth');

// Create Task
router.post('/', auth, async (req, res) => {
  const { title, description, deadline, category, assignedTo } = req.body;
  const task = new Task({
    title,
    description,
    deadline,
    category,
    assignedTo,
    createdBy: req.user._id
  });

  await task.save();
  // Simulate notification
  console.log(`🔔 Task assigned to user ${assignedTo}`);

  res.status(201).json(task);
});

// Get all tasks created by user
router.get('/', auth, async (req, res) => {
  const tasks = await Task.find({ createdBy: req.user._id }).populate('assignedTo', 'name email');
  res.json(tasks);
});

// Update task status
router.put('/:id/status', auth, async (req, res) => {
  const { status } = req.body;
  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, createdBy: req.user._id },
    { status },
    { new: true }
  );
  res.json(task);
});

// Get tasks assigned to current user
router.get('/assigned', auth, async (req, res) => {
  const tasks = await Task.find({ assignedTo: req.user._id });
  res.json(tasks);
});

module.exports = router;

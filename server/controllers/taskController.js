const Task = require('../models/Task');
const Lead = require('../models/Lead');
const User = require('../models/User');

// @desc    Create task
// @route   POST /api/tasks
const createTask = async (req, res) => {
  try {
    const { title, lead, assignedTo, dueDate, status } = req.body;

    // Validate required fields
    if (!title || !lead || !assignedTo || !dueDate) {
      return res.status(400).json({ 
        message: 'Please provide all required fields: title, lead, assignedTo, dueDate' 
      });
    }

    // Check if lead exists
    const leadExists = await Lead.findOne({ _id: lead, isDeleted: false });
    if (!leadExists) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    // Check if assigned user exists
    const userExists = await User.findById(assignedTo);
    if (!userExists) {
      return res.status(404).json({ message: 'Assigned user not found' });
    }

    // Create task
    const task = await Task.create({
      title,
      lead,
      assignedTo,
      dueDate: new Date(dueDate),
      status: status || 'Pending',
    });

    // Populate the task
    const populatedTask = await Task.findById(task._id)
      .populate('lead', 'name email phone')
      .populate('assignedTo', 'name email');

    res.status(201).json(populatedTask);
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all tasks for a user
// @route   GET /api/tasks
const getTasks = async (req, res) => {
  try {
    const { status } = req.query;
    let query = { assignedTo: req.user.id };

    if (status) {
      query.status = status;
    }

    const tasks = await Task.find(query)
      .populate('lead', 'name email phone')
      .populate('assignedTo', 'name email')
      .sort('-createdAt');

    res.json(tasks);
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update task status
// @route   PUT /api/tasks/:id
const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status || !['Pending', 'Completed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if user is assigned to this task
    if (task.assignedTo.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this task' });
    }

    task.status = status;
    await task.save();

    const updatedTask = await Task.findById(task._id)
      .populate('lead', 'name email')
      .populate('assignedTo', 'name email');

    res.json(updatedTask);
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if user is assigned to this task
    if (task.assignedTo.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this task' });
    }

    await task.deleteOne();
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createTask,
  getTasks,
  updateTaskStatus,
  deleteTask,
};
const Lead = require('../models/Lead');
const Task = require('../models/Task');
const mongoose = require('mongoose');

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
const getDashboardStats = async (req, res) => {
  try {
    // Get total leads
    const totalLeads = await Lead.countDocuments({ isDeleted: false });

    // Get qualified leads (Contacted status)
    const qualifiedLeads = await Lead.countDocuments({ 
      isDeleted: false,
      status: 'Contacted' 
    });

    // Get tasks due today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const tasksDueToday = await Task.countDocuments({
      assignedTo: req.user.id,
      dueDate: { $gte: today, $lt: tomorrow },
      status: 'Pending'
    });

    // Get completed tasks
    const completedTasks = await Task.countDocuments({
      assignedTo: req.user.id,
      status: 'Completed'
    });

    // Get leads by status using aggregation
    const leadsByStatus = await Lead.aggregate([
      { $match: { isDeleted: false } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get recent leads
    const recentLeads = await Lead.find({ isDeleted: false })
      .populate('assignedTo', 'name')
      .populate('company', 'name')
      .sort('-createdAt')
      .limit(5);

    res.json({
      totalLeads,
      qualifiedLeads,
      tasksDueToday,
      completedTasks,
      leadsByStatus,
      recentLeads
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDashboardStats,
};
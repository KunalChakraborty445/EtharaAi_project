const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { protect } = require('../middleware/auth');
const {
  createTask,
  getTasks,
  getProjectTasks,
  updateTask,
  deleteTask,
  getDashboardStats
} = require('../controllers/taskController');

// Validation
const taskValidation = [
  body('title')
    .trim()
    .notEmpty().withMessage('Task title is required')
    .isLength({ max: 200 }).withMessage('Title cannot exceed 200 characters'),
  body('projectId')
    .notEmpty().withMessage('Project ID is required'),
  body('dueDate')
    .notEmpty().withMessage('Due date is required')
    .isISO8601().withMessage('Please provide a valid date')
];

// Dashboard stats route (must be before /:id routes)
router.get('/stats/dashboard', protect, getDashboardStats);

// Project tasks route
router.get('/project/:projectId', protect, getProjectTasks);

// Main task routes
router.route('/')
  .get(protect, getTasks)
  .post(protect, taskValidation, createTask);

router.route('/:id')
  .patch(protect, updateTask)
  .delete(protect, deleteTask);

module.exports = router;
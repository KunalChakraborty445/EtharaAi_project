const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { protect } = require('../middleware/auth');
const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  addMember
} = require('../controllers/projectController');

// Validation
const projectValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Project name is required')
    .isLength({ max: 100 }).withMessage('Name cannot exceed 100 characters'),
  body('description')
    .trim()
    .notEmpty().withMessage('Project description is required')
    .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters')
];

const addMemberValidation = [
  body('email')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail()
];

// Routes
router.route('/')
  .get(protect, getProjects)
  .post(protect, projectValidation, createProject);

router.route('/:id')
  .get(protect, getProjectById)
  .patch(protect, updateProject);

router.post('/:id/members', protect, addMemberValidation, addMember);

module.exports = router;
const express = require('express');
const router = express.Router();
const {
  createCompany,
  getCompanies,
  getCompanyById,
} = require('../controllers/companyController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, createCompany)
  .get(protect, getCompanies);

router.get('/:id', protect, getCompanyById);

module.exports = router;
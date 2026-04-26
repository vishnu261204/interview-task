const Company = require('../models/Company');
const Lead = require('../models/Lead');

// @desc    Create company
// @route   POST /api/companies
const createCompany = async (req, res) => {
  try {
    const { name, email, phone, address, website } = req.body;

    // Check if company exists
    const companyExists = await Company.findOne({ name });
    if (companyExists) {
      return res.status(400).json({ message: 'Company already exists' });
    }

    const company = await Company.create({
      name,
      email,
      phone,
      address,
      website,
    });

    res.status(201).json(company);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all companies
// @route   GET /api/companies
const getCompanies = async (req, res) => {
  try {
    const companies = await Company.find().sort('name');
    res.json(companies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get company by ID with associated leads
// @route   GET /api/companies/:id
const getCompanyById = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    // Get associated leads
    const leads = await Lead.find({ company: req.params.id, isDeleted: false })
      .populate('assignedTo', 'name email')
      .sort('-createdAt');

    res.json({
      company,
      leads,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createCompany,
  getCompanies,
  getCompanyById,
};
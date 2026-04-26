const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add company name'],
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please add email'],
    lowercase: true,
  },
  phone: {
    type: String,
    required: [true, 'Please add phone number'],
  },
  address: {
    type: String,
    required: [true, 'Please add address'],
  },
  website: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Company', companySchema);
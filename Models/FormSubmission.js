const mongoose = require('mongoose');

const countrySchema = new mongoose.Schema({
    name: String,
  });
  
  const stateSchema = new mongoose.Schema({
    name: String,
  });
  
const FormSubmission = new mongoose.Schema({
  userId: String,
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  address1: String,
  address2: String,
  state: [stateSchema],
  country: [countrySchema],
  zipCode: String,
});

module.exports = mongoose.model('FormSubmission', FormSubmission);


//Importing npm modules
const mongoose = require("mongoose");

/**
 * creating a scheema of record
 * declaring required fields and specifying data type
 */
const LeadSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  address: { type: String },
  area: { type: String},
  country: { type: String },
  city: { type: String},
  state: { type: String },
  mobileNo: { type: String},
  email: { type: String },
  servicePackage: { type: String},
  pincode: { type: String },
  inquiryDate: { type: String},
  inquiryTime: { type: String },
  source: { type: String},
  leadAllotedTo: { type: String },
  leadStatus: { type: String},
  requriement: { type: String },
  uploadedFile: { type: String},
  followUpDate: { type: String },
  followUpTime: { type: String},
});
//assigning model to const variable
const Leads = mongoose.model("Lead", LeadSchema);

//exporting User
module.exports = Leads;

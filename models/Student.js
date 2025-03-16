const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  roll_number: {
    type: String,
  
  },
  department: {
    type: String,
  
  },
  year: {
    type: Number,
   
  },
  block: {
    type: String,
    required: true
  },
  room_number: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  warden_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Warden",
    required: true
  },
  login_token: {
    type: String,
    unique: true,
    required: true
  },
  qr_history: [{
    date: String,
    code: String,
    used: Boolean
  }]
}, { timestamps: true });

// Add index for better query performance
studentSchema.index({ warden_id: 1, roll_number: 1 });

module.exports = mongoose.model('Student', studentSchema);

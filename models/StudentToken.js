const mongoose = require("mongoose");

const studentTokenSchema = new mongoose.Schema({
  student_id: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  scanned_date: { type: String, required: true }, // Store as "YYYY-MM-DD"
  device_id: { type: String, required: true },
});

module.exports = mongoose.model("StudentToken", studentTokenSchema);

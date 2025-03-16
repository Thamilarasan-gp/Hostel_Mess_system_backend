const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema(
  {
    warden_id: { type: mongoose.Schema.Types.ObjectId, ref: "Warden", required: true },
    student_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true }], // Supports single & multiple students
    secret_text: { type: String, required: true },  // QR Code content
    valid_from: { type: Date, required: true },
    valid_until: { type: Date, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Token", tokenSchema);

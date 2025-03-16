const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema(
  {
    warden_id: { type: mongoose.Schema.Types.ObjectId, ref: "Warden", required: true },
    month: { type: String, required: true },
    qr_code: { type: String, required: true },
    valid_from: { type: Date, required: true },
    valid_until: { type: Date, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Token", tokenSchema);

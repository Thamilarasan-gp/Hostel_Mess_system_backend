const QRCode = require("qrcode");
const Token = require("../models/Token");

const generateToken = async (req, res) => {
  try {
    const { warden_id, student_ids, secret_text } = req.body;

    // Validate secret_text (warden must provide it)
    if (!secret_text) {
      return res.status(400).json({ message: "Secret text is required from the warden!" });
    }

    // Ensure student_ids is always an array
    const studentsArray = Array.isArray(student_ids) ? student_ids : [student_ids];

    const validFrom = new Date();
    const validUntil = new Date();
    validUntil.setDate(validFrom.getDate() + 30); // 30-day validity

    // Save token to DB
    const token = await Token.create({
      warden_id,
      student_ids: studentsArray,
      secret_text, // Use the provided secret_text
      valid_from: validFrom,
      valid_until: validUntil
    });

    // Generate QR Code
    const qrCodeImage = await QRCode.toDataURL(secret_text); // Generate QR from warden's input

    return res.status(201).json({ message: "Token created successfully!", qrCode: qrCodeImage, token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getTokens = async (req, res) => {
  try {
    const tokens = await Token.find().populate("warden_id student_ids");
    return res.status(200).json(tokens);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  generateToken,
  getTokens
};

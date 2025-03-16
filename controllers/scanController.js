const Token = require("../models/Token");
const StudentToken = require("../models/StudentToken");

exports.scanToken = async (req, res) => {
  try {
    const { student_id, scanned_text, device_id } = req.body;
    const today = new Date().toISOString().split("T")[0];

    // Find matching token
    const token = await Token.findOne({ secret_text: scanned_text });
    if (!token) return res.status(400).json({ message: "Invalid QR Code" });

    // Check validity
    if (new Date(today) < token.valid_from || new Date(today) > token.valid_until) {
      return res.status(400).json({ message: "Token expired" });
    }

    // Restrict multiple scans per day per student
    const existingScan = await StudentToken.findOne({ student_id, scanned_date: today });
    if (existingScan) return res.status(400).json({ message: "Already scanned today" });

    // Save scan record
    await StudentToken.create({ student_id, scanned_date: today, device_id });

    return res.status(200).json({ message: "Scan successful! Enjoy your snacks 🍪" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

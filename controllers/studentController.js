const Student = require("../models/Student");
const Token = require("../models/Token");
const mongoose = require("mongoose");

const getStudentsUnderWarden = async (req, res) => {
  try {
    const { wardenId } = req.query; // Get wardenId from request query

    if (!wardenId) {
      return res.status(400).json({ success: false, message: "Warden ID is required" });
    }

    // ✅ Convert wardenId to ObjectId
    const objectId = new mongoose.Types.ObjectId(wardenId);

    const students = await Student.find({ warden_id: objectId });

    res.status(200).json({
      success: true,
      count: students.length,
      students,
    });
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
const getStudentCountUnderWarden = async (req, res) => {
  try {
    const { wardenId } = req.query;

    if (!wardenId) {
      return res.status(400).json({ success: false, message: "Warden ID is required" });
    }

    // Convert wardenId to ObjectId
    const objectId = new mongoose.Types.ObjectId(wardenId);

    // Count students under this warden
    const studentCount = await Student.countDocuments({ warden_id: objectId }); // Use countDocuments() for efficiency

    res.status(200).json({
      success: true,
      studentCount,
    });
  } catch (error) {
    console.error("Error fetching student count:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};



exports.scanQR = async (req, res) => {
  try {
    const { roll_number, qr_code } = req.body;
    const student = await Student.findOne({ roll_number });
    if (!student) return res.status(404).json({ message: "Student not found" });

    const token = await Token.findOne({ qr_code });
    if (!token) return res.status(400).json({ message: "Invalid QR Code" });

    const alreadyUsed = student.qr_history.some((entry) => entry.code === qr_code && entry.used);
    if (alreadyUsed) return res.status(400).json({ message: "QR Code already used" });

    student.qr_history.push({ date: new Date().toISOString(), code: qr_code, used: true });
    await student.save();

    res.json({ message: "QR Code scanned successfully", student });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getStudentsUnderWarden ,getStudentCountUnderWarden }; // ✅ Ensure it's correctly exporte
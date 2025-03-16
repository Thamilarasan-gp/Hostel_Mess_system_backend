const Warden = require("../models/Warden");
const Student = require("../models/Student");
const Token = require("../models/Token");

// Add Student
exports.addStudent = async (req, res) => {
  try {
    const wardenId = req.user.id; // Get warden ID from auth middleware
    const warden = await Warden.findById(wardenId);
    if (!warden) {
      return res.status(401).json({ message: "Unauthorized - Warden not found" });
    }

    const { name, roll_number, department, year, block, room_number, phone,password } = req.body;

    // Create new student with warden reference
    const student = new Student({
      name,
      roll_number,
      department,
      year,
      block: warden.block, // Use warden's block
      room_number,
      phone,
      warden_id: wardenId,
      password,
      login_token: `${roll_number}-${Date.now()}` // Generate unique login token
    });

    await student.save();

    // Add student to warden's assigned_students array
    warden.assigned_students.push(student._id);
    await warden.save();

    res.status(201).json({
      message: "Student added successfully",
      student,
      wardenBlock: warden.block
    });
  } catch (error) {
    console.error('Add student error:', error);
    res.status(500).json({ message: "Error adding student" });
  }
};

// Generate Token
exports.generateToken = async (req, res) => {
  try {
    const { student_id, validity_period } = req.body;

    // Check if warden exists and is authorized
    const warden = await Warden.findById(req.user.id);
    if (!warden) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Find student
    const student = await Student.findById(student_id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Generate unique token
    const token = Math.random().toString(36).substring(2, 15) + 
                 Math.random().toString(36).substring(2, 15);

    // Add to student's QR history
    student.qr_history.push({
      date: new Date().toISOString(),
      code: token,
      used: false
    });

    await student.save();

    res.json({ 
      message: "Token generated successfully", 
      token,
      validity_period 
    });
  } catch (error) {
    console.error('Generate token error:', error);
    res.status(500).json({ 
      message: "Error generating token", 
      error: error.message 
    });
  }
};

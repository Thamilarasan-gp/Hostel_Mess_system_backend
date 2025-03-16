const Warden = require("../models/Warden");
const Student = require("../models/Student");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Warden Signup
exports.wardenSignup = async (req, res) => {
  try {
    const { name, email, phone, password, block } = req.body;

    // Check if password exists and is a string
    if (!password || typeof password !== 'string') {
      return res.status(400).json({ message: "Valid password is required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const warden = new Warden({ 
      name, 
      email, 
      phone, 
      password: hashedPassword, 
      block 
    });

    await warden.save();
    res.status(201).json({ message: "Warden registered successfully" });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Error during registration", error: error.message });
  }
};

// Warden Login
exports.wardenLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const warden = await Warden.findOne({ email });
    if (!warden) {
      return res.status(400).json({ message: "Warden not found" });
    }

    const isMatch = await bcrypt.compare(password, warden.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: warden._id, email: warden.email }, 
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      wardenId: warden._id,
      name: warden.name,
      email: warden.email,
      block: warden.block
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};

// Student Login (Using Token Issued by Warden)
exports.studentLogin = async (req, res) => {
  const { roll_number, token } = req.body;
  const student = await Student.findOne({ roll_number, login_token: token });
  if (!student) return res.status(400).json({ message: "Invalid login credentials" });

  res.json({ message: "Student logged in successfully", student });
};

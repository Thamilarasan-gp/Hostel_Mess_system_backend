const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

// Load environment variables
dotenv.config();

const app = express();

// Route imports
const authRoutes = require("./routes/authRoutes");
const wardenRoutes = require("./routes/wardenRoutes");
const studentRoutes = require("./routes/studentRoutes");
const scanRoutes = require("./routes/scanRoutes");
const tokenRoutes = require('./routes/tokenRoutes'); // Ensure this is correct

// Middleware
app.use(express.json());
app.use(cors());

// Routes - Update route handlers to use the router objects correctly
app.use("/api/auth", authRoutes);
app.use("/api/warden", wardenRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/token", tokenRoutes);
app.use("/api/scan", scanRoutes);

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    process.exit(1);
  }
};

// Call DB Connection
connectDB();

// Sample Route
app.get("/", (req, res) => {
  res.send("Hostel Management System API Running...");
});

// Server Listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

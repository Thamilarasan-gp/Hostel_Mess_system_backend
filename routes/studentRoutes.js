const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { 
  getStudentDetails, 
  scanQR, 
  getStudentsUnderWarden, 
  getStudentCountUnderWarden 
} = require("../controllers/studentController");

const router = express.Router();

// Ensure all route handlers are properly defined
router.get("/under-warden", protect, getStudentsUnderWarden);
router.get("/count", protect, getStudentCountUnderWarden);
router.get("/details/:id", protect, getStudentDetails);
router.post("/scan", protect, scanQR);

module.exports = router;

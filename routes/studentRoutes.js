const express = require("express");

const { protect } = require("../middleware/authMiddleware");
const { getStudentDetails, scanQR, getStudentsUnderWarden, getStudentCountUnderWarden } = require("../controllers/studentController");

const router = express.Router();

router.get("/under-warden", protect, getStudentsUnderWarden);
router.get("/count",getStudentCountUnderWarden);

module.exports = router;

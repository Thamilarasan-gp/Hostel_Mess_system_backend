const express = require("express");
const { addStudent, generateToken } = require("../controllers/wardenController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/add-student", protect, addStudent);
router.post("/generate-token", protect, generateToken);

router.get('/dashboard', (req, res) => {
  res.json({ message: 'Warden dashboard' });
});

module.exports = router;

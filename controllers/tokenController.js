const Token = require("../models/Token");

exports.generateToken = async (req, res) => {
  try {
    const { month, valid_until } = req.body;
    const qr_code = `QR-${month}-${Math.random().toString(36).substring(7)}`;

    const token = new Token({
      warden_id: req.user.id,
      month,
      qr_code,
      valid_from: new Date(),
      valid_until: new Date(valid_until),
    });

    await token.save();
    res.json({ message: "QR Token Generated", token });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAllTokens = async (req, res) => {
  try {
    const tokens = await Token.find({ warden_id: req.user.id });
    res.json(tokens);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.validateQR = async (req, res) => {
  try {
    const { qr_code } = req.body;
    const token = await Token.findOne({ qr_code });

    if (!token) return res.status(404).json({ message: "QR Code not found" });

    const isValid = new Date(token.valid_until) >= new Date();
    res.json({ valid: isValid, token });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

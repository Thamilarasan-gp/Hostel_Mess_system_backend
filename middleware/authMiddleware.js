const jwt = require("jsonwebtoken");
const Warden = require("../models/Warden");

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Not authorized, no token" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // **🔹 Explicitly check for expiration**
        if (decoded.exp && Date.now() >= decoded.exp * 1000) {
            return res.status(401).json({ message: "Token expired, please log in again" });
        }

        req.user = decoded; // Stores decoded user ID in `req.user`
        next();
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token expired, please log in again" });
        } else {
            return res.status(401).json({ message: "Invalid token" });
        }
    }
};

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: "Not authorized, invalid token format" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // **🔹 Explicitly check for expiration**
      if (decoded.exp && Date.now() >= decoded.exp * 1000) {
          return res.status(401).json({ message: "Token expired, please log in again" });
      }
      
      const warden = await Warden.findById(decoded.id).select('-password');
      if (!warden) {
        return res.status(401).json({ message: "Not authorized, warden not found" });
      }

      req.user = {
        id: warden._id,
        email: warden.email,
        name: warden.name
      };
      
      next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
          return res.status(401).json({ message: "Token expired, please log in again" });
      }
      console.error("Token verification failed:", error);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(500).json({ message: "Server error in authentication" });
  }
};

module.exports = { verifyToken, protect };

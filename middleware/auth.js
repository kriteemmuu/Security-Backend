const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

exports.auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Please login first",
      });
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decodedData._id);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User doesn't exist",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error!",
    });
  }
};

//admin Authorize
exports.authAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "You are not authenticated!",
      });
    }

    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "You are not authorized!",
      });
    }

    next();
  } catch (error) {
    console.error("Admin Auth Middleware Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error!",
    });
  }
};

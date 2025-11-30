import jwt from "jsonwebtoken";
import AdminModel from "../models/AdminModel.js";

export const adminAuth = async (req, res, next) => {
  try {
    const accesstoken = req.cookies?.accesstoken || req.headers.accesstoken;

    if (!accesstoken) {
      return res
        .status(400)
        .json({ success: false, message: "Authorization failed." });
    }

    // Verify the JWT token
    const decoded = jwt.verify(accesstoken, process.env.JWT_SECRET);

    // Find admin by ID (using adminId from token)
    const admin = await AdminModel.findById(decoded.adminId);

    if (!admin) {
      return res
        .status(400)
        .json({ success: false, message: "Authorization failed." });
    }

    req.admin = admin;
    next();
  } catch (error) {
    console.error("Auth Error:", error);

    if (error.name === "JsonWebTokenError") {
      return res
        .status(401)
        .json({ success: false, message: "Invalid token." });
    }

    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ success: false, message: "Token expired." });
    }

    if (error.name === "CastError") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid admin ID format." });
    }

    return res
      .status(500)
      .json({ success: false, message: "Authentication failed." });
  }
};

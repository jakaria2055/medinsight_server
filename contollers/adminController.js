import AdminModel from "../models/AdminModel.js";
import { generateTokens } from "../utility/helper.js";
import bcrypt from "bcryptjs";

//******************Admin Register ****************//
export const registerAdmin = async (req, res) => {
  try {
    const { name, email, password, image, location, shortDes } = req.body;

    if (!name || !email || !password || !image || !location || !shortDes) {
      return res
        .status(400)
        .json({ success: false, message: "All credential are required!" });
    }

    const existingAdmin = await AdminModel.findOne({ email });
    if (existingAdmin) {
      return res
        .status(400)
        .json({ success: false, message: "Company Admin Already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new AdminModel({
      name,
      email,
      password: hashedPassword,
      image,
      location,
      shortDes,
    });

    await newAdmin.save();
    res.json({ success: true, message: "Company Admin created successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

//********************LOGIN ADMIN************************
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await AdminModel.findOne({ email });

    if (!admin) {
      return res
        .status(400)
        .json({ success: false, message: "Company Admin not Found!" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Credential" });
    }

    const { accesstoken, refreshtoken, refreshtokenExpires } = generateTokens(
      admin?._id
    );

    admin.refreshtoken.push({
      token: refreshtoken,
      expiresAt: refreshtokenExpires,
    });

    await admin.save();

    res.cookie("refreshtoken", refreshtoken, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.cookie("accesstoken", accesstoken, {
      httpOnly: false,
      secure: true,
      sameSite: "Strict",
      maxAge: 1 * 24 * 60 * 60 * 1000,
    });
    return res
      .status(200)
      .json({
        success: true,
        accesstoken,
        refreshtoken,
        message: "Admin login success.",
      });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//*******************LOGOUT ADMIN***********************//
export const adminLogout = async (req, res) => {
  try {
    const adminId = req.admin?._id; // Assuming you have middleware that sets req.user
    const accesstoken = req.cookies.accesstoken;

    if (!adminId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    await AdminModel.findByIdAndUpdate(
      adminId,
      { $pull: { refreshtokens: { token: accesstoken } } },
      { new: true }
    );

    res.clearCookie("accesstoken");

    return res.status(200).json({
      success: true,
      message: "Admin logged out successfully!",
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

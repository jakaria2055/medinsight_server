import MedicineModel from "../models/MedicineModel.js";
import cloudinary from "../utility/cloudinary.js";

//Add Medicine
export const addMedicine = async (req, res) => {
  try {
    const { name, price, group, effectiveness, sideeffect } = req.body;
    if (!name || !price || !group || !effectiveness || !sideeffect) {
      return res
        .status(400)
        .json({ success: false, message: "All credential are required!" });
    }

    // Validate price is a valid number
    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      return res.status(400).json({
        success: false,
        message: "Price must be a valid positive number!",
      });
    }

    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "Image file is required!" });
    }

    const adminId = req.admin._id;
    // Upload to Cloudinary using the file path
    const uploadResult = await cloudinary.uploader.upload(req.file.path, {
      folder: "medicines",
      resource_type: "image",
    });

    const newMedicine = new MedicineModel({
      name,
      image: uploadResult.secure_url,
      price: parsedPrice,
      group,
      effectiveness,
      sideeffect,
      company: adminId,
    });

    await newMedicine.save();
    return res.status(201).json({
      success: true,
      message: "Medicine info added successfully",
      data: newMedicine,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to add medicine",
    });
  }
};

//Edit Medicine
export const updateMedicine = async (req, res) => {
  try {
    const adminId = req.admin._id;
    const medicineId = req.params.medicineId;
    let reqBody = req.body;

    const medicine = await MedicineModel.findOne({
      _id: medicineId,
      company: adminId,
    });
    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: "Medicine not found or not authorized to update.",
      });
    }

    const updatedMedicine = await MedicineModel.findByIdAndUpdate(
      medicineId,
      { $set: reqBody },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: "Medicine info updated successfully",
      data: updatedMedicine,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to add medicine",
    });
  }
};

//Delete Medicine
export const deleteMedicine = async (req, res) => {
  try {
    const adminId = req.admin._id;
    const medicineId = req.params.medicineId;

    const deletedMedicine = await MedicineModel.findOneAndDelete({
      _id: medicineId,
      company: adminId,
    });

    if (!deletedMedicine) {
      return res.status(404).json({
        success: false,
        message: "Medicine not found or you don't have permission to delete it",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Medicine deleted successfully",
    });
  } catch (error) {
    console.error("Delete medicine error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to delete medicine",
    });
  }
};

export const listByCompany = async (req, res) => {
  try {
    // Get logged-in user/admin ID from middleware (req.user or req.admin)
    const companyId = req.user?._id || req.admin?._id;

    if (!companyId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No company information found.",
      });
    }

    const medicines = await MedicineModel.find({ company: companyId }).sort({
      createdAt: -1,
    });

    if (medicines.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No medicines found for this company.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Medicines fetched successfully.",
      count: medicines.length,
      data: medicines,
    });
  } catch (error) {
    console.error("List By Company Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch medicines.",
    });
  }
};

// ***************** Medicine Details ***************** //
export const medicineDetails = async (req, res) => {
  try {
    const companyId = req.user?._id || req.admin?._id;
    const medicineId = req.params.id;

    if (!companyId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No company information found.",
      });
    }

    // Find a single medicine by ID and company
    const medicine = await MedicineModel.findOne({
      _id: medicineId,
      company: companyId,
    });

    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: "No medicine found for the given ID.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Medicine fetched successfully.",
      data: medicine,
    });
  } catch (error) {
    console.error("Medicine Details Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch medicine details.",
    });
  }
};
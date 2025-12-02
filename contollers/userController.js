import MedicineModel from "../models/MedicineModel.js";

//*************LIstByKeyword*********************//
export const listByKeyWord = async (req, res) => {
  try {
    let SearchRegex = { $regex: req.params.Keyword, $options: "i" };
    let SearchQuery = { $or: [{ name: SearchRegex }, { group: SearchRegex }] };

    let data = await MedicineModel.find(SearchQuery).select(
      "-createdAt -updatedAt"
    ).populate("company", "name image");

    return res.status(200).json({
      success: true,
      message: "Medicine info founded.",
      data: data,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to add medicine",
    });
  }
};

//*****************ListByGroup********************//
export const listByGroup = async (req, res) => {
  try {
    let group = req.params.Group;

    let data = await MedicineModel.find({ group }).select(
      "-createdAt -updatedAt"
    ).populate("company", "name image");

    return res.status(200).json({
      success: true,
      message: "Medicine info founded.",
      data: data,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to find medicine",
    });
  }
};

// ***************** Medicine Details ***************** //
export const searchedMedicineDetails = async (req, res) => {
  try {
    const medicineId = req.params.id;

    // Find a single medicine by ID and company
    const medicine = await MedicineModel.findOne({
      _id: medicineId
    }).populate("company", "name image");

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

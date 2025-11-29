import mongoose from "mongoose";

const medicineSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String, // URL to image
    },
    price: {
      type: Number,
      required: true,
    },
    group: {
      type: String,
      required: true, // e.g., Antibiotic, Painkiller, etc.
    },
    effectiveness: {
      type: String,
      required: true,
    },
    sideeffect: {
      type: String, // side effects
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
  },
  { timestamps: true }
);

const MedicineModel = mongoose.model("Medicine", medicineSchema);
export default MedicineModel;

import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    image: {
      type: String,
      required: true,
    },
    location: {
      type: String,
    },
    shortDes: {
      type: String,
    },
    refreshtoken: [
      {
        token: { type: String, required: true },
        expiresAt: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

const AdminModel = mongoose.model("Admin", adminSchema);
export default AdminModel;

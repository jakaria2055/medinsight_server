import express from "express";
import { adminAuth } from "../middlewares/authMiddlewares.js";
import { adminLogout, loginAdmin, registerAdmin } from "../contollers/adminController.js";
import upload from "../middlewares/uploadMiddleware.js";


const router = express.Router();

//Admin Registration
router.post('/company-admin/register', registerAdmin); 
router.post('/company-admin/login', loginAdmin); 
router.post('/company-admin/logout',adminAuth, adminLogout);


//Admin Operation
router.post('/admin/add-medicine', upload.single("image"), adminAuth, addMedicine); //okk
router.post('/admin/update-medicine/:medicineId', upload.single("image"), adminAuth, updateMedicine); //okk
router.post('/admin/delete-medicine/:medicineId', adminAuth, deleteMedicine); //okk


export default router;
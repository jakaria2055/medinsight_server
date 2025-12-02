import express from "express";
import { adminAuth } from "../middlewares/authMiddlewares.js";
import { adminLogout, loginAdmin, registerAdmin } from "../contollers/adminController.js";
import upload from "../middlewares/uploadMiddleware.js";
import { addMedicine, deleteMedicine, listByCompany, medicineDetails, updateMedicine } from "../contollers/adminTaskController.js";
import { listByGroup, listByKeyWord, searchedMedicineDetails } from "../contollers/userController.js";


const router = express.Router();

//Admin Registration
router.post('/company-admin/register', registerAdmin); 
router.post('/company-admin/login', loginAdmin); 
router.post('/company-admin/logout',adminAuth, adminLogout);


//Admin Operation
router.post('/admin/add-medicine', upload.single("image"), adminAuth, addMedicine); 
router.post('/admin/update-medicine/:medicineId', upload.single("image"), adminAuth, updateMedicine);
router.post('/admin/delete-medicine/:medicineId', adminAuth, deleteMedicine);


//Admin get info
router.get('/admin/MedicineListByCompany',adminAuth, listByCompany);
router.get('/admin/MedicineDetails/:id',adminAuth, medicineDetails);


//User Action
router.get('/user/MedicineListByKeyWord/:Keyword', listByKeyWord);
router.get('/user/MedicineListByGroup/:Group', listByGroup); 
router.get('/user/MedicineDetails/:id', searchedMedicineDetails);


export default router;
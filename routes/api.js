import express from "express";

import { adminAuth } from "../middlewares/authMiddlewares.js";
import { adminLogout, loginAdmin, registerAdmin } from "../contollers/adminController.js";


const router = express.Router();

router.post('/company-admin/register', registerAdmin); 
router.post('/company-admin/login', loginAdmin); 
router.post('/company-admin/logout',adminAuth, adminLogout);


export default router;
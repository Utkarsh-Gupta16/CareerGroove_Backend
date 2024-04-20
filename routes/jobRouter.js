import express from "express";
import { getAllJobs, 
    getmyJobs, 
    postJobs, 
    updateJob, 
    deleteJob, 
    getSinglejob } from "../controllers/jobController.js";
import { isAuthenticated } from "../middlewares/auth.js";
const router=express.Router();

router.get("/getall",getAllJobs); 
router.post("/post",isAuthenticated, postJobs);
router.get("/getmyjobs", isAuthenticated, getmyJobs);
router.put("/update/:id", isAuthenticated, updateJob);
router.delete("/delete/:id", isAuthenticated, deleteJob);
router.get("/:id", isAuthenticated, getSinglejob);


export default router;
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { Application } from "../models/applicationSchema.js";
import cloudinary from 'cloudinary';
import { Job } from "../models/jobSchema.js";


export const postApplication=catchAsyncError(async(req,res,next)=>{
    const{role}=req.user;
    if(role==="Employer"){
        return next(
            new ErrorHandler(
                "Employer is not allowed to access this resource!!!",
                400
            )
        );
    }
    if(!req.files || Object.keys(req.files).length===0){
        return next(
            new ErrorHandler(
                "Please upload your resume", 
                400
            )
        );
    }

    const {resume}=req.files;
    const allowedFormats=["image/png", "image/jpg", "image/jpeg", "image/webp", "application/pdf"];
    
    if(!allowedFormats.includes(resume.mimetype)){
        return next(
            new ErrorHandler(
                "Please upload a valid file", 
                400
            )
        );
    }
    if(resume.size>10*1024*1024){
        return next(
            new ErrorHandler(
                "Invalid file type. Please upload your resume in image or pdf with size less than 10MB", 
                400
            )
        );
    }
    const cloudinaryResponse=await cloudinary.uploader.upload(resume.tempFilePath);

    if(!cloudinaryResponse || cloudinaryResponse.error){
        console.error(
            "Cloudinary Error: ",
            cloudinaryResponse.error ||"Unknown cloudinary error"
        );
        return next(
            new ErrorHandler(
                "Something went wrong while uploading your resume", 
                500
            )
        );
    }

    const{name, email, coverLetter, phone, address, jobId}=req.body;
    const applicantID={
        user:req.user._id,
        role: "Job Seeker",
    };
    if(!jobId){
        return next(
            new ErrorHandler(
                "Job not found", 
                404
            )
        );
    }

    const jobDetails= await Job.findById(jobId);
    if(!jobDetails){
        return next(
            new ErrorHandler(
                "Job not found", 
                404
            )
        );
    }

    const employerID={
        user:jobDetails.postedBy,
        role: "Employer",
    };
    if(
        !name || 
        !email || 
        !coverLetter || 
        !phone || 
        !address || 
        !applicantID ||
        !employerID.user ||
        !resume
    ){
        return next(
            new ErrorHandler(
                "Please enter all application details properly", 
                400
            )
        );
    }

    const application= await Application.create({
        name,
        email,
        coverLetter,
        phone,
        address,
        applicantID,
        employerID: employerID.user,
        resume:{
            public_id:cloudinaryResponse.public_id,
            url:cloudinaryResponse.secure_url,
        },
    });

    res.status(200).json({
        success:true,
        message: "Application submitted successfully",
        application,
    });
});

export const employerGetAllApplications = catchAsyncError(async (req, res, next) => {
    const { role } = req.user;
    if (role === "Job Seeker") {
      return next(new AppError("Job Seeker not allowed to access this resource.", 400));
    }
    const { _id } = req.user;
    const employerID = _id.toString(); // Convert ObjectId to string
  
    const applications = await Application.find({ employerID });
  
    if (applications.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No applications found for this employer",
      });
    }
  
    res.status(200).json({
      success: true,
      applications,
    });
  });

export const jobSeekerGetAllApplications=catchAsyncError(async(req,res,next)=>{
    const{role}=req.user;
    if(role==="Employer"){
        return next(
            new ErrorHandler(
                "Employer is not allowed to access this resource!!!",
                400
            )
        );
    }
    const{_id}=req.user;
    const applications=await Application.find({'applicantID.user':_id});
    res.status(200).json({
        success:true,
        applications,
    });
});

export const jobSeekerDeleteapplication=catchAsyncError(async(req,res,next)=>{
    const{role}=req.user;
    if(role==="Employer"){
        return next(
            new ErrorHandler(
                "Employer is not allowed to access this resource!!!",
                400
            )
        );
    }
    const {id}=req.params;
    const application= await Application.findById(id);
    if(!application){
        return next(
            new ErrorHandler(
                "Sorry!! Application not found", 
                404
            )
        );
    }
    await application.deleteOne();
    res.status(200).json({
        success:true,
        message:"Application deleted successfully",
    });
});

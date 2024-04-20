import mongoose from "mongoose";

const jobSchema=new mongoose.Schema({
    title:{
        type:String,
        required:[true, "Please Enter Job Title"],
        minLength:[3, "Job title must contain 3 characters!!"],
        maxLength:[50, "Job title cannot exceed 50 characters"]
    },
    description:{
        type:String,
        required:[true, "Please Enter Job Title"],
        minLength:[3, "Job title must contain 3 characters!!"],
        maxLength:[350, "Job title cannot exceed 50 characters"]
    }, 
    category:{
        type:String,
        required:[true, "Please Enter Job Category"],
    },
    country:{
        type:String,
        required:[true, "Please Enter Job Country"],
    },
    city:{
        type:String,
        required:[true, "Please Enter Job City"],
    },
    location:{
        type:String,
        required:[true, "Please Enter Exact Job Location"],
        minLength:[10,"Job location must contain atleast 50 characters"],
    },
    fixedSalary:{
        type:Number,
        minLength:[4,"Salary must be greater than 1000"],
        maxLength:[100, "Salary cannot exceed this limit"],        
    },
    salaryFrom:{
        type:Number,
        minLength:[4,"Salary must be greater than 1000"],
        maxLength:[100, "Salary cannot exceed this limit"],
    },
    salaryTo:{
        type:Number,
        minLength:[4,"Salary must be greater than 1000"],
        maxLength:[100, "Salary cannot exceed this limit"],
    },
    expired:{
        type:Boolean,
        default:false,
    },
    jobPostedOn:{
        type:Date,
        default:Date.now,
    },
    postedBy:{
        type: mongoose.Schema.ObjectId,
        ref:"User",
        required:true,
    },
});

export const Job = mongoose.model("Job", jobSchema);
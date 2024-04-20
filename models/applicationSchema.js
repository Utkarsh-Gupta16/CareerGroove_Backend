import exp from "constants";
import mongoose from "mongoose";
import { type } from "os";
import validator from "validator";

const applicationSchema= new mongoose.Schema({
    name:{
        type: String,
        required: [true, "Please Enter Your Name"],
        maxLength: [30, "Name cannot exceed 30 characters"],
        minLength: [4, "Name should have more than 4 characters"],
    }, email:{
        type: String,
        required: [true, "Please Enter Your Email"],
        validate: [validator.isEmail, "Please Enter a valid Email"],
    }, 
    coverLetter:{
        type:String,
        required:[true, "Please Enter Cover Letter message"],
    },
    phone:{
        type:Number,
        required:[true, "Please Enter Your Phone Number"],
    },
    address:{
        type:String,
        required:[true, "Please Enter Your Address"],
    }, resume:{
        public_id:{
            type:String,
            required:true
        },
        url:{
            type: String,
            required:true
        },
    },
    applicantID:{
        user:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true,
        },
        role:{
            type: String,
            required:[true],
            enum:["Job Seeker"],
        }
    },
    employerID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employer",
        required: true,
      },
});

export const Application = mongoose.model("Application", applicationSchema);
import { catchAsyncError } from "./catchAsyncError.js";
import jwt from "jsonwebtoken";
import ErrorHandler from "./error.js";
import {User} from "../models/userSchema.js";

export const isAuthenticated= catchAsyncError(async(req, res, next) => {
    const {token}=req.cookies;
    if(!token){
        return next(new ErrorHandler("User not authorized", 401));
    }
    const decoded=jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user=await User.findById(decoded.id);
    next();
})
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { sendToken } from "../utils/jwtToken.js";
import { User } from "../models/userSchema.js";
export const register = catchAsyncError(async (req, res, next) => {
    const { name, email, phone, password, role } = req.body;

    if (!name ||!email ||!phone ||!role ||!password) {
        return next(new ErrorHandler("Please enter all fields!!"));
    }
    const isEmail = await User.findOne({ email });
    if (isEmail) {
        return next(new ErrorHandler("Email already exists!!"));
    }
    const user = await User.create({
        name,
        email,
        phone,
        password,
        role,
    });
    sendToken(user, 200, res, "User created successfully");
});

export const login = catchAsyncError(async (req, res, next) => {
    const { email, password, role } = req.body;

    if (!email ||!password ||!role) {
        return next(new ErrorHandler("Please provide email, password and role.", 400));
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        return next(new ErrorHandler("Invalid Email or password", 400));
    }
    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
        return next(new ErrorHandler("Invalid Email or password", 400));
    }

    if (user.role!== role) {
        return next(new ErrorHandler("Invalid User Role", 400));
    }
    sendToken(user, 200, res, "User Logged in successfully");
});

export const logout = catchAsyncError(async (req, res, next) => {
    res.status(201).cookie("token", null, {
        httpOnly: true,
        expires: new Date(Date.now()),
        secure:true,
        sameSite:"None",
    });
    res.status(200).json({
        success: true,
        message: "User Logged out successfully!",
    });
});

export const getUser = catchAsyncError(async (req, res, next) => {
    const user = req.user;
    res.status(200).json({
        success: true,
        user,
    });
});
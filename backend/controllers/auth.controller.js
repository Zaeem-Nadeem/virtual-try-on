import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import {sendEmail} from '../utils/emailService.js'
import jwt from "jsonwebtoken";
import bcrypt from'bcryptjs'

const generateAccessAndRefreshTokens = async(userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating tokens");
    }
};

const registerUser = asyncHandler(async (req, res) => {
    const { username, email, fullName, password } = req.body;

    if ([username, email, fullName, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    const existingUser = await User.findOne({
        $or: [{ username }, { email }]
    });

    if (existingUser) {
        throw new ApiError(409, "User with email or username already exists");
    }
    const user = await User.create({
        username: username.toLowerCase(),
        email,
        fullName,
        password
    });

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user");
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    );
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, "Email and password are required");
    }

    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError(404, "User does not exist");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid credentials");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure: true
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200, 
                {
                    user: loggedInUser,
                    accessToken,
                    refreshToken
                },
                "User logged in successfully"
            )
        );
});

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    );

    const options = {
        httpOnly: true,
        secure: true
    };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged out"));
});

// forgetPassword Controller (Send OTP)
// forgetPassword Controller (Send OTP)
const forgetPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;
  
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      throw new ApiError(404, "User not found");
    }
  
    // Generate an OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString(); // 4-digit OTP
  
    // Save OTP and expiry time (15 minutes)
    user.resetPasswordOTP = otp;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15-minute expiry for OTP
    await user.save({validateBeforeSave:false});
  
    // Send OTP to user's email
    const message = `Your OTP for password reset is: ${otp}`;
    await sendEmail(email, 'Password Reset OTP', message);
  
    res.status(200).json(new ApiResponse(200, null, "OTP sent to your email"));
  });
  
  // verifyOtp Controller (Verify OTP and allow reset password)
  const verifyOtp = asyncHandler(async (req, res) => {
    const { email, otp } = req.body;
  
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      throw new ApiError(404, "User not found");
    }
  
    // Check if OTP matches and is not expired
    if (user.resetPasswordOTP !== otp || user.resetPasswordExpire < Date.now()) {
      // Clear OTP if expired or invalid
      user.resetPasswordOTP = undefined;
      user.resetPasswordExpire = undefined; // Clear the expiration date as well
      await user.save({validateBeforeSave:false});
  
      throw new ApiError(400, "Invalid or expired OTP");
    }
  
    // OTP is valid, clear the OTP and allow reset password
    user.resetPasswordOTP = undefined;
    await user.save({validateBeforeSave:false});
  
    res.status(200).json(new ApiResponse(200, null, "OTP verified successfully"));
  });
  
  // resetPassword Controller (Reset the Password)
  const resetPassword = asyncHandler(async (req, res) => {
    const { email, newPassword } = req.body;
  
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      throw new ApiError(404, "User not found");
    }
  
    // Validate password strength
    if (!newPassword || newPassword.length < 6) {
      throw new ApiError(400, "Password must be at least 6 characters long");
    }
  
    // Update the password (hash the password before saving)
    user.password=newPassword
    await user.save();
  
    res.status(200).json(new ApiResponse(200, null, "Password reset successfully"));
  });
  
  
export {
    registerUser,
    loginUser,
    logoutUser,
    forgetPassword,
    verifyOtp,
    resetPassword,
};
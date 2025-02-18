import { Router } from "express";
import {
    registerUser,
    loginUser,
    logoutUser,
    forgetPassword,
    verifyOtp,
    resetPassword,
} from "../controllers/auth.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT, logoutUser);

router.route("/forgot-password").post(forgetPassword);
router.route("/verify-otp").post(verifyOtp);
router.route("/reset-password").post(resetPassword);

export default router;
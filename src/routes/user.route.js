import { Router } from "express";
import { loginUser, logoutUser, sendOtpForRegistration, verifyOtpAndRegister } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register/send-otp").post(sendOtpForRegistration);

router.route("/register/verify-otp").post(verifyOtpAndRegister);

router.route("/login").post(loginUser);

router.route("/logout").post(verifyJWT, logoutUser);

export default router
import { Router } from "express";
import { 
    signupUser, 
    loginUser, 
    logoutUser, 
    getCurrentUser,
    googleLogin,
    updateProfile,
    forgotPassword,
    resetPassword
} from "../controllers/auth.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/signup").post(upload.single("profilePicture"), signupUser);
router.route("/login").post(loginUser);
router.route("/google-login").post(googleLogin);
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password/:token").post(resetPassword);

// secured routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/update-profile").patch(verifyJWT, upload.single("profilePicture"), updateProfile);

export default router;

import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { User } from '../models/user.model.js';
import { OAuth2Client } from 'google-auth-library';
import fetch from 'node-fetch';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { v2 as cloudinary } from 'cloudinary';
import sendEmail from '../utils/sendEmail.js';
import crypto from 'crypto';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        return { accessToken };
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating token");
    }
};

const signupUser = asyncHandler(async (req, res) => {
    const { fullName, email, password } = req.body;

    if (!fullName?.trim() || !email?.trim() || !password?.trim()) {
        throw new ApiError(400, "All fields are required");
    }

    const existedUser = await User.findOne({ email });
    if (existedUser) {
        throw new ApiError(409, "User with email already exists");
    }

    let profilePictureUrl = "";
    if (req.file) {
        const cloudinaryResponse = await uploadOnCloudinary(req.file.path);
        if (cloudinaryResponse) {
            profilePictureUrl = cloudinaryResponse.secure_url;
        }
    }

    const user = await User.create({
        fullName,
        email,
        password,
        profilePicture: profilePictureUrl
    });

    const createdUser = await User.findById(user._id).select("-password");

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user");
    }

    return res.status(201).json(
        new ApiResponse(201, createdUser, "User registered successfully")
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
        throw new ApiError(401, "Invalid user credentials");
    }

    const { accessToken } = await generateToken(user._id);

    const loggedInUser = await User.findById(user._id).select("-password");

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        path: "/",
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser,
                    accessToken
                },
                "User logged in successfully"
            )
        );
});

const logoutUser = asyncHandler(async (req, res) => {
    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        path: "/",
    };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .json(new ApiResponse(200, {}, "User logged out"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(new ApiResponse(200, req.user, "Current user fetched successfully"));
});

const googleLogin = asyncHandler(async (req, res) => {
    const { idToken, googleAccessToken } = req.body;

    let email, name, sub, picture;

    if (idToken) {
        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        email = payload.email;
        name = payload.name;
        sub = payload.sub;
        picture = payload.picture;
    } else if (googleAccessToken) {
        const response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${googleAccessToken}`);
        const data = await response.json();
        email = data.email;
        name = data.name;
        sub = data.sub;
        picture = data.picture;

        if (!email) {
            throw new ApiError(400, "Invalid Access Token");
        }
    } else {
        throw new ApiError(400, "Token is required");
    }

    let user = await User.findOne({ email });

    // Helper to upload remote URL to Cloudinary
    const uploadRemoteToCloudinary = async (url) => {
        try {
            const res = await cloudinary.uploader.upload(url, {
                folder: "NexNote/Profiles",
                resource_type: "image"
            });
            return res.secure_url;
        } catch (error) {
            console.error("Cloudinary Remote Upload Error:", error);
            return url; // Fallback to original URL
        }
    };

    if (!user) {
        let finalPicture = picture || "";
        if (picture) {
            finalPicture = await uploadRemoteToCloudinary(picture);
        }

        user = await User.create({
            fullName: name,
            email,
            profilePicture: finalPicture,
            password: sub + Math.random().toString(36).substring(7),
        });
    } else {
        // If user exists but no profile picture, or if it's still a Google URL, maybe update/sync
        if (picture && (!user.profilePicture || user.profilePicture.includes("googleusercontent"))) {
            user.profilePicture = await uploadRemoteToCloudinary(picture);
            await user.save({ validateBeforeSave: false });
        }
    }

    const { accessToken } = await generateToken(user._id);
    const loggedInUser = await User.findById(user._id).select("-password");

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        path: "/",
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser,
                    accessToken
                },
                "Google login successful"
            )
        );
});

const updateProfile = asyncHandler(async (req, res) => {
    const { fullName, email, currentPassword, newPassword } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    if (fullName) user.fullName = fullName;
    
    if (email && email !== user.email) {
        const existedUser = await User.findOne({ email });
        if (existedUser) {
            throw new ApiError(409, "Email already in use");
        }
        user.email = email;
    }

    if (newPassword) {
        if (!currentPassword) {
            throw new ApiError(400, "Current password is required to change password");
        }
        const isPasswordCorrect = await user.isPasswordCorrect(currentPassword);
        if (!isPasswordCorrect) {
            throw new ApiError(401, "Invalid current password");
        }
        user.password = newPassword;
    }

    if (req.file) {
        const cloudinaryResponse = await uploadOnCloudinary(req.file.path);
        if (cloudinaryResponse) {
            user.profilePicture = cloudinaryResponse.secure_url;
        }
    }

    await user.save();

    const updatedUser = await User.findById(userId).select("-password");

    return res
        .status(200)
        .json(new ApiResponse(200, updatedUser, "Profile updated successfully"));
});

const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) {
        throw new ApiError(400, "Email is required");
    }

    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError(404, "User with this email does not exist");
    }

    // Generate token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash and set to forgotPasswordToken field
    user.forgotPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    // Set expiry (e.g., 20 minutes)
    user.forgotPasswordExpiry = Date.now() + 20 * 60 * 1000;

    await user.save({ validateBeforeSave: false });

    // Send Email
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
            <h2 style="color: #00f2ff; text-align: center;">NexNote Password Reset</h2>
            <p>Hello ${user.fullName},</p>
            <p>You are receiving this email because you (or someone else) have requested the reset of the password for your account.</p>
            <p>Please click on the button below to reset your password. This link is valid for 20 minutes:</p>
            <div style="text-align: center; margin: 30px 0;">
                <a href="${resetUrl}" style="background-color: #00f2ff; color: #000; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
            </div>
            <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="font-size: 12px; color: #888; text-align: center;">NexNote SaaS Platform - Your Digital Second Brain</p>
        </div>
    `;

    try {
        await sendEmail({
            email: user.email,
            subject: "NexNote Password Reset Request",
            html,
        });

        return res.status(200).json(
            new ApiResponse(200, {}, "Password reset email sent successfully")
        );
    } catch (error) {
        user.forgotPasswordToken = undefined;
        user.forgotPasswordExpiry = undefined;
        await user.save({ validateBeforeSave: false });
        throw new ApiError(500, "Email could not be sent");
    }
});

const resetPassword = asyncHandler(async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
        throw new ApiError(400, "New password is required");
    }

    // Hash the token from URL
    const hashedToken = crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');

    const user = await User.findOne({
        forgotPasswordToken: hashedToken,
        forgotPasswordExpiry: { $gt: Date.now() },
    });

    if (!user) {
        throw new ApiError(400, "Token is invalid or has expired");
    }

    // Set new password
    user.password = password;
    user.forgotPasswordToken = undefined;
    user.forgotPasswordExpiry = undefined;

    await user.save();

    return res.status(200).json(
        new ApiResponse(200, {}, "Password reset successful")
    );
});

export {
    signupUser,
    loginUser,
    logoutUser,
    getCurrentUser,
    googleLogin,
    updateProfile,
    forgotPassword,
    resetPassword
};

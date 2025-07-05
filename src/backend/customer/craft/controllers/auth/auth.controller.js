const OTPService = require("../../services/auth/otp.service.js");
const authService = require("../../services/auth/auth.service.js");
const mobileUtil = require("../../util/mobile.util");
const jwt = require("jsonwebtoken");
const e = require("express");

exports.signUp = async (req, res) => {
    const { email, name, mobile } = req.body;
    if (!email) return res.status(200).json({ status: 406, message: "Not acceptable", error: "Email address is required" });
    if (!name) return res.status(200).json({ status: 406, message: "Not acceptable", error: "Name is required" });
    if (!mobile) return res.status(200).json({ status: 406, message: "Not acceptable", error: "Mobile number is required" });
    if (typeof email !== "string" || !email.includes("@")) {
        return res.status(200).json({ status: 406, message: "Not acceptable", error: "Email address is invalied" });
    }
    const result = await authService.signup(email, name, mobileUtil.validateMobile(mobile));
    if (result && result.error) {
        return res.status(200).json({ status: 401, message: "Unauthorized", error: result.message });
    }
    return res.status(201).json({ status: 201, message: "OK", data: "User registered successfully." });
};

exports.signIn = async (req, res) => {
    const { mobile, otp } = req.body;
    if (!mobile) return res.status(200).json({ status: 406, message: "Not acceptable", error: "Mobile number is required" });
    if (!otp) return res.status(200).json({ status: 406, message: "Not acceptable", error: "OTP is required" });
    const result = await authService.signIn(mobileUtil.validateMobile(mobile), otp);
    if (result && result.error) {
        return res.status(200).json({ status: 401, message: "Unauthorized", error: result.message });
    }
    return res.status(200).json({ status: 200, message: "OK", data: result });
};

exports.requestOTP = async (req, res) => {
    const { mobile } = req.body;
    if (!mobile) return res.status(200).json({ status: 406, message: "Not acceptable", error: "Mobile number is required" });
    const result = await OTPService.generateOTP(mobileUtil.validateMobile(mobile));
    if (result && result.error) {
        return res.status(200).json({ status: 401, message: "Unauthorized", error: result.message });
    }
    return res.status(200).json({ 
         status: 200,
         message: "OK", 
         data: "OTP sent successfully." });
};

exports.refreshToken = async (req, res) => {
    if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer")) {
        return res.status(200).json({ status: 401, message: "Unauthorized", error: "Token is missing or invalid." });
    }
    const token = req.headers.authorization.split(" ")[1];
    const result = await authService.refreshToken(token);
    if (result && result.error) {
        return res.status(200).json({ status: 401, message: "Unauthorized", error: "Token refresh failed" });
    }
    return res.status(200).json({ status: 200, message: "OK", data: {refreshedToken: result} });
};

exports.profile = async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(200).json({ status: 401, message: "Unauthorized", error: "Token is missing or invalid." });
    }
    const token = authHeader.split(" ")[1];
    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        return res.status(200).json({ status: 401, message: "Unauthorized", error: "Token is invalid." });
    }
    const mobile = decoded.mobile;
    if (!mobile) {
        return res.status(200).json({ status: 401, message: "Unauthorized", error: "Mobile number is missing in token." });
    }
    const result = await authService.profile(mobile);
    if (result && result.error) {
        return res.status(200).json({ status: 401, message: "Unauthorized", error: result.message });
    }
    return res.status(200).json({ status: 200, message: "OK", data: result });
};


exports.editProfile = async (req, res) => {
    const { name, email, image } = req.body;

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(200).json({ status: 401, error: true, message: "Token is missing or invalid." });
    }
    const token = authHeader.split(" ")[1];
    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        return res.status(200).json({ status: 401, error: true, message: "Token is invalid." });
    }
    const mobile = decoded.mobile;
    if (!mobile) {
        return res.status(200).json({ status: 401, error: true, message: "Mobile number is missing in token." });
    }
    if (!name && !email && !image) {
        return res.status(200).json({ status: 406, message: "Not Acceptable", error: "At least one field (name, email, or image) is required to update." });
    }
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (image) updateData.image = image;

    const result = await authService.editProfile(mobile, updateData);
    if (result && result.error) {
       return res.status(200).json({ status: 401, message: "Unauthorized", error: result.message });
    }
    return res.status(200).json({ status: 200, message: "OK", data: "Profile updated successfully." });
};
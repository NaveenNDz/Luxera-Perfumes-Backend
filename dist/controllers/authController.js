"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshTokenHandler = exports.login = exports.register = void 0;
const userModel_1 = require("../models/userModel");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwtUtil_1 = require("../util/jwtUtil");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "luxera-refresh-secret";
const register = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        const existingUser = await userModel_1.UserModel.findOne({ email });
        if (existingUser)
            return res.status(400).json({
                message: "Email already exists!",
            });
        const userCount = await userModel_1.UserModel.countDocuments();
        const role = userCount === 0 ? "ADMIN" : "USER";
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const newUser = new userModel_1.UserModel({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            roles: [role],
        });
        await newUser.save();
        res.status(201).json({
            message: "Account created successfully!",
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Registration failed",
        });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel_1.UserModel.findOne({ email });
        if (!user)
            return res.status(401).json({
                message: "Invalid credentials",
            });
        const isValid = await bcryptjs_1.default.compare(password, user.password);
        if (!isValid)
            return res.status(401).json({
                message: "Invalid credentials",
            });
        const accessToken = (0, jwtUtil_1.signAccessToken)(user);
        const refreshToken = (0, jwtUtil_1.signRefreshToken)(user);
        res.status(200).json({
            message: "Login successful",
            data: {
                firstName: user.firstName,
                email: user.email,
                roles: user.roles,
                access_token: accessToken,
                refresh_token: refreshToken,
            },
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Login error",
        });
    }
};
exports.login = login;
const refreshTokenHandler = async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken)
        return res.status(401).json({
            message: "Refresh token required",
        });
    try {
        const payload = jsonwebtoken_1.default.verify(refreshToken, JWT_REFRESH_SECRET);
        const user = await userModel_1.UserModel.findById(payload.sub);
        if (!user)
            return res.status(403).json({
                message: "Invalid refresh token",
            });
        const newAccessToken = (0, jwtUtil_1.signAccessToken)(user);
        res.status(200).json({
            access_token: newAccessToken,
        });
    }
    catch (error) {
        res.status(403).json({
            message: "Invalid or expired refresh token",
        });
    }
};
exports.refreshTokenHandler = refreshTokenHandler;

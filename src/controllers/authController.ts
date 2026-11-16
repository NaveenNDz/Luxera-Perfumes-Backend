import { Request, Response } from "express";
import { UserModel } from "../models/userModel";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { signAccessToken, signRefreshToken } from "../util/jwtUtil";
import dotenv from "dotenv";

dotenv.config();

const JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET || "luxera-refresh-secret";

export const register = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const existingUser = await UserModel.findOne({ email });

    if (existingUser)
      return res.status(400).json({
        message: "Email already exists!",
      });

    const userCount = await UserModel.countDocuments();
    const role = userCount === 0 ? "ADMIN" : "USER";

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new UserModel({
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
  } catch (error) {
    res.status(500).json({
      message: "Registration failed",
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });

    if (!user)
      return res.status(401).json({
        message: "Invalid credentials",
      });

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid)
      return res.status(401).json({
        message: "Invalid credentials",
      });

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);

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
  } catch (error) {
    res.status(500).json({
      message: "Login error",
    });
  }
};

export const refreshTokenHandler = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken)
    return res.status(401).json({
      message: "Refresh token required",
    });

  try {
    const payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as any;

    const user = await UserModel.findById(payload.sub);

    if (!user)
      return res.status(403).json({
        message: "Invalid refresh token",
      });

    const newAccessToken = signAccessToken(user);

    res.status(200).json({
      access_token: newAccessToken,
    });
  } catch (error) {
    res.status(403).json({
      message: "Invalid or expired refresh token",
    });
  }
};

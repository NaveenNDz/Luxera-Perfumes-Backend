import { Request, Response } from "express";
import { UserModel, UserRole } from "../models/userModel";
import bcrypt from "bcryptjs";
import { signAccessToken, signRefreshToken } from "../util/jwtUtil";
import { AuthRequest } from "../middleware/auth";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_REFRESH_SECRET = (process.env.JWT_REFRESH_SECRET ||
  process.env.JWT_SECRET) as string;

export const register = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        message: "Missing required fields..!",
      });
    }

    const extUser = await UserModel.findOne({ email });
    if (extUser) {
      return res.status(400).json({
        message: "User already exists..!",
      });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const newUser = new UserModel({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      roles: [UserRole.USER],
      isBlocked: false,
      isEmailVerified: false,
      image: "/images/default-profile.png",
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully..!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Registration fail",
      error: err,
    });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "missing data....!",
    });
  }

  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials..!" });
    }

    if (user.isBlocked) {
      return res.status(403).json({ message: "Your account is blocked..!" });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: "Invalid credentials..!" });
    }

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);

    res.status(200).json({
      message: "OK",
      data: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        roles: user.roles,
        image: user.image,
        access_token: accessToken,
        refresh_token: refreshToken,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Internal server error while login..!",
    });
  }
};

export const getMyDetails = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const user = await UserModel.findById(req.user.sub).select("-password");

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  const { _id, firstName, lastName, email, roles, image } = user;

  res.status(200).json({
    message: "ok",
    data: { id: _id, firstName, lastName, email, roles, image },
  });
};

export const getRefreshToken = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  try {
    if (!refreshToken) {
      return res.status(400).json({
        message: "Token required..!",
      });
    }

    const payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as {
      sub: string;
    };
    const userId = payload?.sub;
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(403).json({
        message: "Invalid or expire token..!",
      });
    }

    const newAccessToken = signAccessToken(user);
    res.status(200).json({
      data: { accessToken: newAccessToken },
    });
  } catch (err) {
    res.status(403).json({ message: "Invalid or expire token" });
    console.error(err);
  }
};

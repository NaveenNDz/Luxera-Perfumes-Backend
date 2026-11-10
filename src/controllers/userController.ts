import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User, UserRole } from "../models/userModel.js";
import { signAccessToken, signRefreshToken } from "../util/jwtUtil.js";

export async function registerUser(req: Request, res: Response) {
  try {
    const { firstName, lastName, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      roles: [UserRole.USER],
      isBlocked: false,
      isEmailVerified: false,
      image:
        "https://res.cloudinary.com/dxjv7gq2f/image/upload/v1690911680/Default-Profile-Picture-1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_q6zq3k.png",
    });

    await newUser.save();
    return res.status(201).json({
      message: "User registered successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error registering user",
    });
  }
}

export async function loginUser(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.isBlocked) {
      return res.status(403).json({
        message: "Your account has been suspended",
      });
    }

    const isMatch = bcrypt.compareSync(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials!",
      });
    }

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);

    return res.status(200).json({
      message: "Login Successful",
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        roles: user.roles,
        image: user.image,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error logging in",
    });
  }
}

export async function refreshTokenHandler(req: Request, res: Response) {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        message: "Refresg token is required",
      });
    }

    jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET as string,
      async (err: any, decoded: any) => {
        if (err || !decoded) {
          return res.status(403).json({
            message: "Invalid or expired refresh token",
          });
        }
        const user = await User.findById(decoded.sub);

        if (!user) {
          return res.status(404).json({
            message: "User not found",
          });
        }

        const newAccessToken = signAccessToken(user);
        return res.status(200).json({
          accessToken: newAccessToken,
        });
      },
    );
  } catch (error) {
    return res.status(500).json({
      message: "Error refreshing token",
    });
  }
}

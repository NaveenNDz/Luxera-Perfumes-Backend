import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { IUser } from "../models/userModel";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "luxera-secret";
const JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET || "luxera-refresh-secret";

export const signAccessToken = (user: IUser) => {
  return jwt.sign(
    {
      sub: user._id.toString(),
      roles: user.roles,
    },
    JWT_SECRET,
    { expiresIn: "15m" },
  );
};

export const signRefreshToken = (user: IUser) => {
  return jwt.sign(
    {
      sub: user._id.toString(),
    },
    JWT_REFRESH_SECRET,
    { expiresIn: "7d" },
  );
};

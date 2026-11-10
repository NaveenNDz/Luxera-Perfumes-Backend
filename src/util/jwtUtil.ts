import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { IUser } from "../models/userModel.js";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "";

export const signAccessToken = (User: IUser) => {
  return jwt.sign(
    {
      sub: User._id.toString(),
      roles: User.roles,
    },
    JWT_SECRET,
    { expiresIn: "30m" },
  );
};

export const signRefreshToken = (User: IUser) => {
  return jwt.sign(
    {
      sub: User._id.toHexString(),
      roles: User.roles,
    },
    JWT_REFRESH_SECRET,
    { expiresIn: "7d" },
  );
};

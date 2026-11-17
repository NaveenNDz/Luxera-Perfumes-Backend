import express from "express";
import {
  register,
  login,
  refreshTokenHandler,
  getUsers,
  updateUser,
  deleteUser,
} from "../controllers/authController";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh-token", refreshTokenHandler);
router.get("/users", getUsers);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

export default router;

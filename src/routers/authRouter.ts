import express from "express";
import { register, login, getMyDetails, getRefreshToken,} from "../controllers/authController";
import { authenticate } from "../middleware/auth";
 
 

const AuthRouter = express.Router();

AuthRouter.post("/register", register);
AuthRouter.post("/login", login);
AuthRouter.post("/refresh-token", getRefreshToken);
AuthRouter.get("/me", authenticate, getMyDetails);

export default AuthRouter;

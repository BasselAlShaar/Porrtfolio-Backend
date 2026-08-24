import { Router } from "express";

//Controller imports
import authController from "../https/controllers/auth.controller.js";

//Middleware imports
import { strictLimit } from "../https/middlewares/rateLimiter.js";
import authMiddleware from "../https/middlewares/auth.middleware.js";
import requireAdmin from "../https/middlewares/requireAdmin.middleware.js";

const authRouter = Router();

//Login
authRouter.post('/login', strictLimit, authMiddleware, authController.login);

//logout
authRouter.post('/logout', requireAdmin, authController.logout);

export default authRouter;
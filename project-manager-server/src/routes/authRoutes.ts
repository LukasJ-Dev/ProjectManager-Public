import { NextFunction, Router, Response } from "express";
import * as authController from "../controllers/authController";
import { AuthenticatedRequest } from "../types";

const router = Router();

router.post("/login", authController.login);

router.post("/register", authController.register);

router.get("/user", authController.authenticate, authController.getUser);

export default router;

import { Router } from "express";
import * as aiController from "../controllers/aiController";
import { authenticate } from "../controllers/authController";

const router = Router();

router.post("/suggestions", authenticate, aiController.suggest);

export default router;

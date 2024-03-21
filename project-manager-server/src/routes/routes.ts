import { Router } from "express";
import authRoutes from "./authRoutes";
import aiRoutes from "./aiRoutes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/ai", aiRoutes);

export default router;

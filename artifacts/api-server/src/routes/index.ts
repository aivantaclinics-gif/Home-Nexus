import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import roomsRouter from "./rooms";
import devicesRouter from "./devices";
import automationsRouter from "./automations";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/auth", authRouter);
router.use("/rooms", roomsRouter);
router.use("/devices", devicesRouter);
router.use("/automations", automationsRouter);

export default router;

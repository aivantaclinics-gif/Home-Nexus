import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { devicesTable } from "@workspace/db/schema";
import { eq, and } from "drizzle-orm";
import { CreateDeviceBody, UpdateDeviceBody, GetDevicesQueryParams } from "@workspace/api-zod";
import { getUserFromRequest } from "./auth";

const router: IRouter = Router();

router.get("/", async (req, res) => {
  const user = await getUserFromRequest(req);
  if (!user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const queryParsed = GetDevicesQueryParams.safeParse(req.query);
  const roomId = queryParsed.success ? queryParsed.data.roomId : undefined;

  let devices;
  if (roomId) {
    devices = await db.select().from(devicesTable).where(
      and(eq(devicesTable.userId, user.id), eq(devicesTable.roomId, roomId))
    );
  } else {
    devices = await db.select().from(devicesTable).where(eq(devicesTable.userId, user.id));
  }

  res.json(devices);
});

router.post("/", async (req, res) => {
  const user = await getUserFromRequest(req);
  if (!user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const parsed = CreateDeviceBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Bad Request", message: "Invalid request body" });
    return;
  }

  const [device] = await db.insert(devicesTable).values({
    ...parsed.data,
    userId: user.id,
    isOn: false,
  }).returning();

  res.status(201).json(device);
});

router.get("/:deviceId", async (req, res) => {
  const user = await getUserFromRequest(req);
  if (!user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const deviceId = parseInt(req.params.deviceId);
  const [device] = await db.select().from(devicesTable).where(
    and(eq(devicesTable.id, deviceId), eq(devicesTable.userId, user.id))
  ).limit(1);

  if (!device) {
    res.status(404).json({ error: "Not Found", message: "Device not found" });
    return;
  }

  res.json(device);
});

router.patch("/:deviceId", async (req, res) => {
  const user = await getUserFromRequest(req);
  if (!user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const deviceId = parseInt(req.params.deviceId);
  const parsed = UpdateDeviceBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Bad Request", message: "Invalid request body" });
    return;
  }

  const [device] = await db.update(devicesTable)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(and(eq(devicesTable.id, deviceId), eq(devicesTable.userId, user.id)))
    .returning();

  if (!device) {
    res.status(404).json({ error: "Not Found", message: "Device not found" });
    return;
  }

  res.json(device);
});

router.post("/:deviceId/toggle", async (req, res) => {
  const user = await getUserFromRequest(req);
  if (!user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const deviceId = parseInt(req.params.deviceId);
  const [existing] = await db.select().from(devicesTable).where(
    and(eq(devicesTable.id, deviceId), eq(devicesTable.userId, user.id))
  ).limit(1);

  if (!existing) {
    res.status(404).json({ error: "Not Found", message: "Device not found" });
    return;
  }

  const [device] = await db.update(devicesTable)
    .set({ isOn: !existing.isOn, updatedAt: new Date() })
    .where(and(eq(devicesTable.id, deviceId), eq(devicesTable.userId, user.id)))
    .returning();

  res.json(device);
});

export default router;

import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { roomsTable, devicesTable } from "@workspace/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { CreateRoomBody } from "@workspace/api-zod";
import { getUserFromRequest } from "./auth";

const router: IRouter = Router();

router.get("/", async (req, res) => {
  const user = await getUserFromRequest(req);
  if (!user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const rooms = await db.select().from(roomsTable).where(eq(roomsTable.userId, user.id));

  const roomsWithCounts = await Promise.all(
    rooms.map(async (room) => {
      const devices = await db.select().from(devicesTable).where(eq(devicesTable.roomId, room.id));
      const deviceCount = devices.length;
      const activeCount = devices.filter(d => d.isOn).length;
      return {
        ...room,
        deviceCount,
        activeCount,
      };
    })
  );

  res.json(roomsWithCounts);
});

router.post("/", async (req, res) => {
  const user = await getUserFromRequest(req);
  if (!user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const parsed = CreateRoomBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Bad Request", message: "Invalid request body" });
    return;
  }

  const [room] = await db.insert(roomsTable).values({
    ...parsed.data,
    userId: user.id,
  }).returning();

  res.status(201).json({ ...room, deviceCount: 0, activeCount: 0 });
});

router.get("/:roomId", async (req, res) => {
  const user = await getUserFromRequest(req);
  if (!user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const roomId = parseInt(req.params.roomId);
  const [room] = await db.select().from(roomsTable).where(
    and(eq(roomsTable.id, roomId), eq(roomsTable.userId, user.id))
  ).limit(1);

  if (!room) {
    res.status(404).json({ error: "Not Found", message: "Room not found" });
    return;
  }

  const devices = await db.select().from(devicesTable).where(eq(devicesTable.roomId, room.id));
  res.json({ ...room, deviceCount: devices.length, activeCount: devices.filter(d => d.isOn).length });
});

export default router;

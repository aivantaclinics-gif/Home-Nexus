import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { GoogleSignInBody } from "@workspace/api-zod";
import jwt from "jsonwebtoken";

const router: IRouter = Router();

const JWT_SECRET = process.env.JWT_SECRET || "elkanawy-os-secret-2024";

function generateToken(userId: number): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "30d" });
}

export function verifyToken(token: string): { userId: number } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: number };
  } catch {
    return null;
  }
}

export async function getUserFromRequest(req: any): Promise<typeof usersTable.$inferSelect | null> {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) return null;

  const token = authHeader.slice(7);
  const payload = verifyToken(token);
  if (!payload) return null;

  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, payload.userId)).limit(1);
  return user || null;
}

router.get("/user", async (req, res) => {
  const user = await getUserFromRequest(req);
  if (!user) {
    res.status(401).json({ error: "Unauthorized", message: "Invalid or missing token" });
    return;
  }
  res.json({
    id: user.id,
    googleId: user.googleId,
    email: user.email,
    name: user.name,
    avatarUrl: user.avatarUrl,
    createdAt: user.createdAt,
  });
});

router.post("/google", async (req, res) => {
  const parsed = GoogleSignInBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Bad Request", message: "Invalid request body" });
    return;
  }

  const { credential } = parsed.data;

  // Decode the JWT credential from Google (ID token)
  // In production you'd verify with Google's public keys
  // For now we decode and extract user info
  let googlePayload: any;
  try {
    const parts = credential.split(".");
    if (parts.length !== 3) throw new Error("Invalid JWT");
    const payload = Buffer.from(parts[1], "base64url").toString("utf8");
    googlePayload = JSON.parse(payload);
  } catch {
    res.status(401).json({ error: "Unauthorized", message: "Invalid Google credential" });
    return;
  }

  const { sub: googleId, email, name, picture: avatarUrl } = googlePayload;

  if (!email || !name) {
    res.status(401).json({ error: "Unauthorized", message: "Missing user info in token" });
    return;
  }

  // Upsert user
  let [user] = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);

  if (!user) {
    const [newUser] = await db.insert(usersTable).values({
      googleId,
      email,
      name,
      avatarUrl: avatarUrl || null,
    }).returning();
    user = newUser;

    // Seed default rooms and devices for new user
    await seedUserData(user.id);
  } else {
    // Update profile info
    await db.update(usersTable)
      .set({ googleId, name, avatarUrl: avatarUrl || null })
      .where(eq(usersTable.id, user.id));
  }

  const token = generateToken(user.id);

  res.json({
    user: {
      id: user.id,
      googleId: user.googleId,
      email: user.email,
      name: user.name,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt,
    },
    token,
  });
});

router.post("/logout", (_req, res) => {
  res.json({ success: true, message: "Logged out" });
});

async function seedUserData(userId: number) {
  const { roomsTable, devicesTable, automationsTable } = await import("@workspace/db/schema");

  const [living] = await db.insert(roomsTable).values({ name: "Living Room", icon: "sofa", userId }).returning();
  const [bedroom] = await db.insert(roomsTable).values({ name: "Bedroom", icon: "bed", userId }).returning();
  const [kitchen] = await db.insert(roomsTable).values({ name: "Kitchen", icon: "chef-hat", userId }).returning();
  const [bathroom] = await db.insert(roomsTable).values({ name: "Bathroom", icon: "bath", userId }).returning();

  const devices = [
    { name: "Ceiling Light", type: "light", roomId: living.id, userId, value: 80, unit: "%", powerUsage: 9, isOn: true },
    { name: "Floor Lamp", type: "light", roomId: living.id, userId, value: 60, unit: "%", powerUsage: 7, isOn: false },
    { name: "AC Unit", type: "ac", roomId: living.id, userId, value: 22, unit: "°C", powerUsage: 1500, isOn: true },
    { name: "Smart TV", type: "tv", roomId: living.id, userId, value: null, unit: null, powerUsage: 120, isOn: false },
    { name: "Ceiling Fan", type: "fan", roomId: living.id, userId, value: 3, unit: "speed", powerUsage: 45, isOn: true },

    { name: "Bedside Lamp", type: "light", roomId: bedroom.id, userId, value: 40, unit: "%", powerUsage: 5, isOn: false },
    { name: "Bedroom AC", type: "ac", roomId: bedroom.id, userId, value: 20, unit: "°C", powerUsage: 1200, isOn: false },
    { name: "Thermostat", type: "thermostat", roomId: bedroom.id, userId, value: 21, unit: "°C", powerUsage: 5, isOn: true },
    { name: "Smart Lock", type: "lock", roomId: bedroom.id, userId, value: null, unit: null, powerUsage: 2, isOn: false },

    { name: "Kitchen Light", type: "light", roomId: kitchen.id, userId, value: 100, unit: "%", powerUsage: 12, isOn: true },
    { name: "Exhaust Fan", type: "fan", roomId: kitchen.id, userId, value: 2, unit: "speed", powerUsage: 30, isOn: false },

    { name: "Bathroom Light", type: "light", roomId: bathroom.id, userId, value: 90, unit: "%", powerUsage: 8, isOn: false },
    { name: "Security Camera", type: "camera", roomId: bathroom.id, userId, value: null, unit: null, powerUsage: 10, isOn: true },
  ];

  const insertedDevices = await db.insert(devicesTable).values(devices as any).returning();

  // Add some automations
  const livingLight = insertedDevices.find(d => d.name === "Ceiling Light");
  const bedroomAc = insertedDevices.find(d => d.name === "Bedroom AC");

  if (livingLight && bedroomAc) {
    await db.insert(automationsTable).values([
      {
        name: "Morning Lights",
        deviceId: livingLight.id,
        action: "turn_on",
        triggerType: "schedule",
        triggerTime: "07:00",
        triggerDays: "mon,tue,wed,thu,fri",
        isEnabled: true,
        userId,
      },
      {
        name: "Night AC",
        deviceId: bedroomAc.id,
        action: "turn_on",
        triggerType: "schedule",
        triggerTime: "22:00",
        triggerDays: "mon,tue,wed,thu,fri,sat,sun",
        value: 20,
        isEnabled: true,
        userId,
      },
      {
        name: "Evening Ambiance",
        deviceId: livingLight.id,
        action: "set_value",
        triggerType: "sunset",
        value: 40,
        isEnabled: false,
        userId,
      },
    ]);
  }
}

export default router;

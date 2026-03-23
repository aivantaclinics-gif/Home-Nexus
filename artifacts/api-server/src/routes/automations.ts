import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { automationsTable } from "@workspace/db/schema";
import { eq, and } from "drizzle-orm";
import { CreateAutomationBody, UpdateAutomationBody } from "@workspace/api-zod";
import { getUserFromRequest } from "./auth";

const router: IRouter = Router();

router.get("/", async (req, res) => {
  const user = await getUserFromRequest(req);
  if (!user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const automations = await db.select().from(automationsTable).where(eq(automationsTable.userId, user.id));
  res.json(automations);
});

router.post("/", async (req, res) => {
  const user = await getUserFromRequest(req);
  if (!user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const parsed = CreateAutomationBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Bad Request", message: "Invalid request body" });
    return;
  }

  const [automation] = await db.insert(automationsTable).values({
    ...parsed.data,
    userId: user.id,
    isEnabled: true,
  }).returning();

  res.status(201).json(automation);
});

router.patch("/:automationId", async (req, res) => {
  const user = await getUserFromRequest(req);
  if (!user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const automationId = parseInt(req.params.automationId);
  const parsed = UpdateAutomationBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Bad Request", message: "Invalid request body" });
    return;
  }

  const [automation] = await db.update(automationsTable)
    .set(parsed.data)
    .where(and(eq(automationsTable.id, automationId), eq(automationsTable.userId, user.id)))
    .returning();

  if (!automation) {
    res.status(404).json({ error: "Not Found", message: "Automation not found" });
    return;
  }

  res.json(automation);
});

router.delete("/:automationId", async (req, res) => {
  const user = await getUserFromRequest(req);
  if (!user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const automationId = parseInt(req.params.automationId);
  await db.delete(automationsTable).where(
    and(eq(automationsTable.id, automationId), eq(automationsTable.userId, user.id))
  );

  res.json({ success: true, message: "Automation deleted" });
});

export default router;

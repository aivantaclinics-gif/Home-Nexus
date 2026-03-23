import { pgTable, text, serial, timestamp, integer, boolean, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";
import { devicesTable } from "./devices";

export const automationsTable = pgTable("automations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  deviceId: integer("device_id").notNull().references(() => devicesTable.id, { onDelete: "cascade" }),
  action: text("action").notNull(),
  triggerType: text("trigger_type").notNull(),
  triggerTime: text("trigger_time"),
  triggerDays: text("trigger_days"),
  value: real("value"),
  isEnabled: boolean("is_enabled").notNull().default(true),
  userId: integer("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertAutomationSchema = createInsertSchema(automationsTable).omit({ id: true, createdAt: true });
export type InsertAutomation = z.infer<typeof insertAutomationSchema>;
export type Automation = typeof automationsTable.$inferSelect;

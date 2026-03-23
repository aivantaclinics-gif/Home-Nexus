import { pgTable, text, serial, timestamp, integer, boolean, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";
import { roomsTable } from "./rooms";

export const devicesTable = pgTable("devices", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  isOn: boolean("is_on").notNull().default(false),
  roomId: integer("room_id").notNull().references(() => roomsTable.id, { onDelete: "cascade" }),
  userId: integer("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  value: real("value"),
  unit: text("unit"),
  powerUsage: real("power_usage"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertDeviceSchema = createInsertSchema(devicesTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertDevice = z.infer<typeof insertDeviceSchema>;
export type Device = typeof devicesTable.$inferSelect;

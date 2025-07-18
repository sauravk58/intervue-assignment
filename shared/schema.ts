import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const polls = pgTable("polls", {
  id: serial("id").primaryKey(),
  question: text("question").notNull(),
  options: jsonb("options").notNull().$type<Array<{id: string, text: string, isCorrect: boolean}>>(),
  isActive: boolean("is_active").notNull().default(false),
  duration: integer("duration").notNull().default(60),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  endedAt: timestamp("ended_at"),
});

export const responses = pgTable("responses", {
  id: serial("id").primaryKey(),
  pollId: integer("poll_id").notNull().references(() => polls.id),
  studentName: text("student_name").notNull(),
  selectedOption: text("selected_option").notNull(),
  submittedAt: timestamp("submitted_at").notNull().defaultNow(),
});

export const sessions = pgTable("sessions", {
  id: serial("id").primaryKey(),
  studentName: text("student_name").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  connectedAt: timestamp("connected_at").notNull().defaultNow(),
});

export const insertPollSchema = createInsertSchema(polls).omit({
  id: true,
  isActive: true,
  createdAt: true,
  endedAt: true,
});

export const insertResponseSchema = createInsertSchema(responses).omit({
  id: true,
  submittedAt: true,
});

export const insertSessionSchema = createInsertSchema(sessions).omit({
  id: true,
  isActive: true,
  connectedAt: true,
});

export type Poll = typeof polls.$inferSelect;
export type InsertPoll = z.infer<typeof insertPollSchema>;
export type Response = typeof responses.$inferSelect;
export type InsertResponse = z.infer<typeof insertResponseSchema>;
export type Session = typeof sessions.$inferSelect;
export type InsertSession = z.infer<typeof insertSessionSchema>;
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferSelect;

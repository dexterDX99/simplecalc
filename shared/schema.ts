import { pgTable, text, serial, integer, boolean, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Investment Pools
export const investmentPools = pgTable("investment_pools", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  startDate: text("start_date").notNull(),
  endDate: text("end_date").notNull(),
  duration: text("duration").notNull(),
  closeDate: text("close_date").notNull(),
  total: numeric("total").notNull().default("0"),
  target: numeric("target").notNull(),
  investors: integer("investors").notNull().default(0),
  slots: integer("slots").notNull(),
  minProfitRate: numeric("min_profit_rate").notNull(),
  maxProfitRate: numeric("max_profit_rate").notNull(),
  companyDescription: text("company_description").notNull().default(""),
  companyWebsite: text("company_website").notNull().default(""),
  companySocial: text("company_social").notNull().default(""),
  companyContact: text("company_contact").notNull().default(""),
  businessModel: text("business_model").notNull().default(""),
  returnRatio: text("return_ratio").notNull().default(""),
});

export const insertPoolSchema = createInsertSchema(investmentPools).omit({
  id: true,
});

export type InsertPool = z.infer<typeof insertPoolSchema>;
export type Pool = typeof investmentPools.$inferSelect;

// Investments
export const investments = pgTable("investments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  poolId: integer("pool_id").notNull(),
  amount: numeric("amount").notNull(),
  createdAt: text("created_at").notNull(),
});

export const insertInvestmentSchema = createInsertSchema(investments).omit({
  id: true,
  createdAt: true,
});

export type InsertInvestment = z.infer<typeof insertInvestmentSchema>;
export type Investment = typeof investments.$inferSelect;

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
  section1StartDate: text("section1_start_date").notNull(),
  section1EndDate: text("section1_end_date").notNull(),
  section2StartDate: text("section2_start_date").notNull(),
  section2EndDate: text("section2_end_date").notNull(),
  duration: text("duration").notNull(),
  closeDate: text("close_date").notNull(),
  section1Total: numeric("section1_total").notNull().default("0"),
  section2Total: numeric("section2_total").notNull().default("0"),
  target: numeric("target").notNull(),
  section1Investors: integer("section1_investors").notNull().default(0),
  section2Investors: integer("section2_investors").notNull().default(0),
  section1Slots: integer("section1_slots").notNull(),
  section2Slots: integer("section2_slots").notNull(),
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

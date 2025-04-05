import express, { type Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertInvestmentSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes
  
  // Get all investment pools
  app.get("/api/pools", async (req, res) => {
    try {
      const pools = await storage.getPools();
      res.json(pools);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch investment pools" });
    }
  });
  
  // Get specific pool by ID
  app.get("/api/pools/:id", async (req, res) => {
    try {
      const poolId = parseInt(req.params.id);
      if (isNaN(poolId)) {
        return res.status(400).json({ message: "Invalid pool ID" });
      }
      
      const pool = await storage.getPool(poolId);
      if (!pool) {
        return res.status(404).json({ message: "Pool not found" });
      }
      
      res.json(pool);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch pool" });
    }
  });
  
  // Create investment
  app.post("/api/investments", async (req, res) => {
    try {
      const data = insertInvestmentSchema.parse(req.body);
      
      // Check if pool exists
      const pool = await storage.getPool(data.poolId);
      if (!pool) {
        return res.status(404).json({ message: "Investment pool not found" });
      }
      
      // Calculate slots based on investment amount
      const calculatedSlots = Math.floor(Number(data.amount) / 5000);
      
      // Check if pool has enough slots
      if (pool.slots < calculatedSlots || Number(pool.total) >= Number(pool.target)) {
        return res.status(400).json({ message: "Not enough slots available in the pool" });
      }
      
      // Check if investment amount is valid and within slot limits
      const remainingAmount = Number(pool.target) - Number(pool.total);
      if (Number(data.amount) > remainingAmount || calculatedSlots > 100) {
        return res.status(400).json({ 
          message: `You can only invest up to PKR ${Math.min(remainingAmount, 500000).toLocaleString()}` 
        });
      }
      
      // Create investment
      const investment = await storage.createInvestment(data);
      
      res.status(201).json(investment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid investment data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create investment" });
      }
    }
  });
  
  // Get investments by user
  app.get("/api/users/:userId/investments", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const investments = await storage.getInvestmentsByUser(userId);
      res.json(investments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch investments" });
    }
  });
  
  // Reset user investments (for testing purposes)
  app.post("/api/users/:userId/reset", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      await storage.resetForUser(userId);
      res.json({ message: "User investments and pools reset successfully" });
    } catch (error) {
      console.error("Reset error:", error);
      res.status(500).json({ message: "Failed to reset user data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

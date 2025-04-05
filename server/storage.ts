import { 
  users, type User, type InsertUser,
  investmentPools, type Pool, type InsertPool,
  investments, type Investment, type InsertInvestment
} from "@shared/schema";

// modify the interface with any CRUD methods
// you might need
export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Pool methods
  getPools(): Promise<Pool[]>;
  getPool(id: number): Promise<Pool | undefined>;
  createPool(pool: InsertPool): Promise<Pool>;
  updatePool(id: number, updates: Partial<Pool>): Promise<Pool | undefined>;

  // Investment methods
  createInvestment(investment: InsertInvestment): Promise<Investment>;
  getInvestmentsByUser(userId: number): Promise<Investment[]>;

  // Reset method for testing purposes
  resetForUser(userId: number): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private pools: Map<number, Pool>;
  private investments: Map<number, Investment>;

  private userCurrentId: number;
  private poolCurrentId: number;
  private investmentCurrentId: number;

  constructor() {
    this.users = new Map();
    this.pools = new Map();
    this.investments = new Map();

    this.userCurrentId = 1;
    this.poolCurrentId = 1;
    this.investmentCurrentId = 1;

    // Initialize with LED Bulb Manufacturing pool
    const initialPools: InsertPool[] = [
      { 
        name: "LED Bulb Manufacturing", 
        startDate: "May 1, 2025", 
        endDate: "Aug 1, 2025", 
        duration: "3 Months", 
        closeDate: "Jul 15, 2025", 
        total: "0",
        target: "1500000",
        investors: 0,
        slots: 300,
        minProfitRate: "0.30",
        maxProfitRate: "0.30",
        returnRatio: "30-40%",
        companyDescription: "We manufacture high-quality, energy-efficient LED bulbs for residential and commercial use. Our products save up to 90% energy compared to traditional incandescent bulbs and last up to 25,000 hours. This investment will expand our production capacity to meet growing demand in the local market.",
        companyWebsite: "www.ledpakistan.com",
        companySocial: "@ledpakistan",
        companyContact: "+92-300-1234567",
        businessModel: "Manufacturing and wholesale distribution of LED lighting products to retailers and construction companies. Our business benefits from government incentives for energy-efficient products and growing consumer awareness about energy conservation."
      }
    ];

    // Clear any existing investments
    this.investments = new Map();

    initialPools.forEach(pool => this.createPool(pool));
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getPools(): Promise<Pool[]> {
    return Array.from(this.pools.values());
  }

  async getPool(id: number): Promise<Pool | undefined> {
    return this.pools.get(id);
  }

  async createPool(insertPool: InsertPool): Promise<Pool> {
    const id = this.poolCurrentId++;

    // Ensure all required fields are present
    const pool: Pool = { 
      ...insertPool, 
      id,
      // Ensure these fields have default values if not provided
      total: insertPool.total || "0",
      investors: insertPool.investors || 0,
      companyDescription: insertPool.companyDescription || "",
      companyWebsite: insertPool.companyWebsite || "",
      companySocial: insertPool.companySocial || "",
      companyContact: insertPool.companyContact || "",
      businessModel: insertPool.businessModel || "",
      returnRatio: insertPool.returnRatio || ""
    };

    this.pools.set(id, pool);
    return pool;
  }

  async updatePool(id: number, updates: Partial<Pool>): Promise<Pool | undefined> {
    const pool = this.pools.get(id);
    if (!pool) return undefined;

    const updatedPool = { ...pool, ...updates };
    this.pools.set(id, updatedPool);
    return updatedPool;
  }

  async createInvestment(insertInvestment: InsertInvestment): Promise<Investment> {
    const id = this.investmentCurrentId++;
    // Add createdAt field required by the schema
    const investment: Investment = { 
      ...insertInvestment, 
      id,
      createdAt: new Date().toISOString()
    };
    this.investments.set(id, investment);

    // Update pool data
    const pool = this.pools.get(insertInvestment.poolId);
    if (pool) {
      const newTotal = Number(pool.total) + Number(insertInvestment.amount);
      const updatedPool: Pool = {
        ...pool,
        total: newTotal.toString(),
        investors: pool.investors + 1,
        slots: pool.slots - Math.floor(Number(investment.amount) / 500000) * 100 //updated line
      };
      this.pools.set(pool.id, updatedPool);
    }

    return investment;
  }

  async getInvestmentsByUser(userId: number): Promise<Investment[]> {
    return Array.from(this.investments.values()).filter(
      (investment) => investment.userId === userId
    );
  }

  async resetForUser(userId: number): Promise<void> {
    // Get user's investments
    const userInvestments = await this.getInvestmentsByUser(userId);

    // Process each investment to update pools and remove the investments
    for (const investment of userInvestments) {
      // Get the pool for this investment
      const pool = await this.getPool(investment.poolId);
      if (pool) {
        // Decrease total investment amount and increase slots
        const newTotal = Number(pool.total) - Number(investment.amount);
        const updatedPool: Pool = {
          ...pool,
          total: newTotal > 0 ? newTotal.toString() : "0",
          investors: pool.investors > 0 ? pool.investors - 1 : 0,
          slots: pool.slots + Math.floor(Number(investment.amount) / 500000) * 100 //updated line
        };
        // Update the pool
        await this.updatePool(pool.id, updatedPool);
      }

      // Remove the investment from storage
      this.investments.delete(investment.id);
    }

    // Reset the initial pool if all investments are gone
    if (this.investments.size === 0) {
      const pools = await this.getPools();

      // Reset each pool to initial state
      for (const pool of pools) {
        await this.updatePool(pool.id, {
          total: "0",
          investors: 0,
          slots: 300 // Reset to original number of slots
        });
      }
    }
  }
}

export const storage = new MemStorage();
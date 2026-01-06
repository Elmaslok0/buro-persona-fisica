import { eq, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { 
  InsertUser, users,
  clients, InsertClient,
  addresses, InsertAddress,
  employments, InsertEmployment,
  creditAccounts, InsertCreditAccount,
  creditQueries, InsertCreditQuery,
  creditReports, InsertCreditReport,
  documents, InsertDocument,
  alerts, InsertAlert,
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;
let _client: ReturnType<typeof postgres> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _client = postgres(process.env.DATABASE_URL);
      _db = drizzle(_client);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const existing = await db.select().from(users).where(eq(users.openId, user.openId)).limit(1);
    
    if (existing.length > 0) {
      // Update existing user
      const updateData: Partial<InsertUser> = {};
      if (user.name !== undefined) updateData.name = user.name;
      if (user.email !== undefined) updateData.email = user.email;
      if (user.loginMethod !== undefined) updateData.loginMethod = user.loginMethod;
      if (user.lastSignedIn !== undefined) updateData.lastSignedIn = user.lastSignedIn;
      if (user.role !== undefined) updateData.role = user.role;
      
      updateData.updatedAt = new Date();
      
      await db.update(users).set(updateData).where(eq(users.openId, user.openId));
    } else {
      // Insert new user
      const values: InsertUser = {
        openId: user.openId,
        name: user.name,
        email: user.email,
        loginMethod: user.loginMethod,
        role: user.openId === ENV.ownerOpenId ? 'admin' : (user.role || 'user'),
        lastSignedIn: user.lastSignedIn || new Date(),
      };
      
      await db.insert(users).values(values);
    }
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ============ CLIENT FUNCTIONS ============

export async function createClient(client: InsertClient) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(clients).values(client).returning();
  return result[0];
}

export async function getClientsByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(clients).where(eq(clients.userId, userId));
}

export async function getClientById(clientId: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(clients).where(eq(clients.id, clientId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateClient(clientId: number, data: Partial<InsertClient>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.update(clients).set(data).where(eq(clients.id, clientId));
}

// ============ ADDRESS FUNCTIONS ============

export async function createAddress(address: InsertAddress) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.insert(addresses).values(address);
}

export async function getAddressesByClientId(clientId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(addresses).where(eq(addresses.clientId, clientId));
}

// ============ EMPLOYMENT FUNCTIONS ============

export async function createEmployment(employment: InsertEmployment) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.insert(employments).values(employment);
}

export async function getEmploymentsByClientId(clientId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(employments).where(eq(employments.clientId, clientId));
}

// ============ CREDIT ACCOUNT FUNCTIONS ============

export async function createCreditAccount(account: InsertCreditAccount) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.insert(creditAccounts).values(account);
}

export async function getCreditAccountsByClientId(clientId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(creditAccounts).where(eq(creditAccounts.clientId, clientId));
}

// ============ CREDIT QUERY FUNCTIONS ============

export async function createCreditQuery(query: InsertCreditQuery) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.insert(creditQueries).values(query);
}

export async function getCreditQueriesByClientId(clientId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(creditQueries)
    .where(eq(creditQueries.clientId, clientId))
    .orderBy(desc(creditQueries.createdAt));
}

// ============ CREDIT REPORT FUNCTIONS ============

export async function createCreditReport(report: InsertCreditReport) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.insert(creditReports).values(report);
}

export async function getCreditReportsByClientId(clientId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(creditReports)
    .where(eq(creditReports.clientId, clientId))
    .orderBy(desc(creditReports.createdAt));
}

export async function getCreditReportById(reportId: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(creditReports).where(eq(creditReports.id, reportId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ============ DOCUMENT FUNCTIONS ============

export async function createDocument(document: InsertDocument) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.insert(documents).values(document);
}

export async function getDocumentsByClientId(clientId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(documents)
    .where(eq(documents.clientId, clientId))
    .orderBy(desc(documents.createdAt));
}

// ============ ALERT FUNCTIONS ============

export async function createAlert(alert: InsertAlert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.insert(alerts).values(alert);
}

export async function getAlertsByClientId(clientId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(alerts)
    .where(eq(alerts.clientId, clientId))
    .orderBy(desc(alerts.createdAt));
}

export async function markAlertAsRead(alertId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.update(alerts).set({ leida: 1 }).where(eq(alerts.id, alertId));
}

import { eq, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
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
  llmAnalysis, InsertLLMAnalysis
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
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
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
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
  
  const result = await db.insert(clients).values(client);
  return result;
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
  
  return await db.update(alerts).set({ isRead: 1 }).where(eq(alerts.id, alertId));
}

// ============ LLM ANALYSIS FUNCTIONS ============

export async function createLLMAnalysis(analysis: InsertLLMAnalysis) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.insert(llmAnalysis).values(analysis);
}

export async function getLLMAnalysisByClientId(clientId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(llmAnalysis)
    .where(eq(llmAnalysis.clientId, clientId))
    .orderBy(desc(llmAnalysis.createdAt));
}

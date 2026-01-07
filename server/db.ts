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

// Almacenamiento en memoria para cuando no hay base de datos
const inMemoryStorage = {
  users: new Map<string, any>(),
  clients: new Map<number, any>(),
  addresses: new Map<number, any>(),
  employments: new Map<number, any>(),
  creditAccounts: new Map<number, any>(),
  creditQueries: new Map<number, any>(),
  creditReports: new Map<number, any>(),
  documents: new Map<number, any>(),
  alerts: new Map<number, any>(),
  llmAnalysis: new Map<number, any>(),
  nextId: {
    clients: 1,
    addresses: 1,
    employments: 1,
    creditAccounts: 1,
    creditQueries: 1,
    creditReports: 1,
    documents: 1,
    alerts: 1,
    llmAnalysis: 1,
  }
};

export async function getDb() {
  // Siempre usar null para forzar almacenamiento en memoria
  // Esto permite que el sistema funcione sin base de datos
  if (!_db && process.env.DATABASE_URL && process.env.DATABASE_URL !== 'memory') {
    try {
      _db = drizzle(process.env.DATABASE_URL);
      console.log("[Database] Connected successfully");
    } catch (error) {
      console.warn("[Database] Failed to connect, using in-memory storage:", error);
      _db = null;
    }
  }
  // Si no hay DATABASE_URL o es 'memory', usar almacenamiento en memoria
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    // Usar almacenamiento en memoria
    inMemoryStorage.users.set(user.openId, {
      id: inMemoryStorage.users.size + 1,
      ...user,
      createdAt: new Date(),
    });
    console.log("[Database] User saved to in-memory storage");
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
    return inMemoryStorage.users.get(openId);
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ============ CLIENT FUNCTIONS ============

export async function createClient(client: InsertClient) {
  const db = await getDb();
  if (!db) {
    const id = inMemoryStorage.nextId.clients++;
    const newClient = {
      id,
      ...client,
      createdAt: new Date(),
    };
    inMemoryStorage.clients.set(id, newClient);
    console.log("[Database] Client saved to in-memory storage:", id);
    return { insertId: id };
  }
  
  const result = await db.insert(clients).values(client);
  return result;
}

export async function getClientsByUserId(userId: number) {
  const db = await getDb();
  if (!db) {
    return Array.from(inMemoryStorage.clients.values()).filter(c => c.userId === userId);
  }
  
  try {
    return await db.select().from(clients).where(eq(clients.userId, userId));
  } catch (error) {
    console.error("[Database] Error fetching clients for userId", userId, ":", error);
    // Retornar array vacío en caso de error
    return [];
  }
}

export async function getClientById(clientId: number) {
  const db = await getDb();
  if (!db) {
    return inMemoryStorage.clients.get(clientId);
  }
  
  try {
    const result = await db.select().from(clients).where(eq(clients.id, clientId)).limit(1);
    return result.length > 0 ? result[0] : undefined;
  } catch (error) {
    console.error("[Database] Error fetching client by id", clientId, ":", error);
    return undefined;
  }
}

export async function updateClient(clientId: number, data: Partial<InsertClient>) {
  const db = await getDb();
  if (!db) {
    const existing = inMemoryStorage.clients.get(clientId);
    if (existing) {
      inMemoryStorage.clients.set(clientId, { ...existing, ...data });
    }
    return { affectedRows: existing ? 1 : 0 };
  }
  
  try {
    return await db.update(clients).set(data).where(eq(clients.id, clientId));
  } catch (error) {
    console.error("[Database] Error updating client", clientId, ":", error);
    return { affectedRows: 0 };
  }
}

// ============ ADDRESS FUNCTIONS ============

export async function createAddress(address: InsertAddress) {
  const db = await getDb();
  if (!db) {
    const id = inMemoryStorage.nextId.addresses++;
    inMemoryStorage.addresses.set(id, { id, ...address, createdAt: new Date() });
    return { insertId: id };
  }
  
  return await db.insert(addresses).values(address);
}

export async function getAddressesByClientId(clientId: number) {
  const db = await getDb();
  if (!db) {
    return Array.from(inMemoryStorage.addresses.values()).filter(a => a.clientId === clientId);
  }
  
  return await db.select().from(addresses).where(eq(addresses.clientId, clientId));
}

// ============ EMPLOYMENT FUNCTIONS ============

export async function createEmployment(employment: InsertEmployment) {
  const db = await getDb();
  if (!db) {
    const id = inMemoryStorage.nextId.employments++;
    inMemoryStorage.employments.set(id, { id, ...employment, createdAt: new Date() });
    return { insertId: id };
  }
  
  return await db.insert(employments).values(employment);
}

export async function getEmploymentsByClientId(clientId: number) {
  const db = await getDb();
  if (!db) {
    return Array.from(inMemoryStorage.employments.values()).filter(e => e.clientId === clientId);
  }
  
  return await db.select().from(employments).where(eq(employments.clientId, clientId));
}

// ============ CREDIT ACCOUNT FUNCTIONS ============

export async function createCreditAccount(account: InsertCreditAccount) {
  const db = await getDb();
  if (!db) {
    const id = inMemoryStorage.nextId.creditAccounts++;
    inMemoryStorage.creditAccounts.set(id, { id, ...account, createdAt: new Date() });
    return { insertId: id };
  }
  
  return await db.insert(creditAccounts).values(account);
}

export async function getCreditAccountsByClientId(clientId: number) {
  const db = await getDb();
  if (!db) {
    return Array.from(inMemoryStorage.creditAccounts.values()).filter(a => a.clientId === clientId);
  }
  
  return await db.select().from(creditAccounts).where(eq(creditAccounts.clientId, clientId));
}

// ============ CREDIT QUERY FUNCTIONS ============

export async function createCreditQuery(query: InsertCreditQuery) {
  const db = await getDb();
  if (!db) {
    const id = inMemoryStorage.nextId.creditQueries++;
    inMemoryStorage.creditQueries.set(id, { id, ...query, createdAt: new Date() });
    return { insertId: id };
  }
  
  return await db.insert(creditQueries).values(query);
}

export async function getCreditQueriesByClientId(clientId: number) {
  const db = await getDb();
  if (!db) {
    return Array.from(inMemoryStorage.creditQueries.values())
      .filter(q => q.clientId === clientId)
      .sort((a, b) => b.createdAt - a.createdAt);
  }
  
  return await db.select().from(creditQueries)
    .where(eq(creditQueries.clientId, clientId))
    .orderBy(desc(creditQueries.createdAt));
}

// ============ CREDIT REPORT FUNCTIONS ============

export async function createCreditReport(report: InsertCreditReport) {
  const db = await getDb();
  if (!db) {
    const id = inMemoryStorage.nextId.creditReports++;
    inMemoryStorage.creditReports.set(id, { id, ...report, createdAt: new Date() });
    console.log("[Database] Credit report saved to in-memory storage:", id);
    return { insertId: id };
  }
  
  return await db.insert(creditReports).values(report);
}

export async function getCreditReportsByClientId(clientId: number) {
  const db = await getDb();
  if (!db) {
    return Array.from(inMemoryStorage.creditReports.values())
      .filter(r => r.clientId === clientId)
      .sort((a, b) => b.createdAt - a.createdAt);
  }
  
  try {
    return await db.select().from(creditReports)
      .where(eq(creditReports.clientId, clientId))
      .orderBy(desc(creditReports.createdAt));
  } catch (error) {
    console.error("[Database] Error fetching credit reports for clientId", clientId, ":", error);
    return [];
  }
}

export async function getCreditReportById(reportId: number) {
  const db = await getDb();
  if (!db) {
    return inMemoryStorage.creditReports.get(reportId);
  }
  
  try {
    const result = await db.select().from(creditReports).where(eq(creditReports.id, reportId)).limit(1);
    return result.length > 0 ? result[0] : undefined;
  } catch (error) {
    console.error("[Database] Error fetching credit report by id", reportId, ":", error);
    return undefined;
  }
}

// ============ DOCUMENT FUNCTIONS ============

export async function createDocument(document: InsertDocument) {
  const db = await getDb();
  if (!db) {
    const id = inMemoryStorage.nextId.documents++;
    inMemoryStorage.documents.set(id, { id, ...document, createdAt: new Date() });
    return { insertId: id };
  }
  
  return await db.insert(documents).values(document);
}

export async function getDocumentsByClientId(clientId: number) {
  const db = await getDb();
  if (!db) {
    return Array.from(inMemoryStorage.documents.values())
      .filter(d => d.clientId === clientId)
      .sort((a, b) => b.createdAt - a.createdAt);
  }
  
  return await db.select().from(documents)
    .where(eq(documents.clientId, clientId))
    .orderBy(desc(documents.createdAt));
}

// ============ ALERT FUNCTIONS ============

export async function createAlert(alert: InsertAlert) {
  const db = await getDb();
  if (!db) {
    const id = inMemoryStorage.nextId.alerts++;
    inMemoryStorage.alerts.set(id, { id, ...alert, createdAt: new Date() });
    return { insertId: id };
  }
  
  return await db.insert(alerts).values(alert);
}

export async function getAlertsByClientId(clientId: number) {
  const db = await getDb();
  if (!db) {
    return Array.from(inMemoryStorage.alerts.values())
      .filter(a => a.clientId === clientId)
      .sort((a, b) => b.createdAt - a.createdAt);
  }
  
  return await db.select().from(alerts)
    .where(eq(alerts.clientId, clientId))
    .orderBy(desc(alerts.createdAt));
}

export async function markAlertAsRead(alertId: number) {
  const db = await getDb();
  if (!db) {
    const existing = inMemoryStorage.alerts.get(alertId);
    if (existing) {
      inMemoryStorage.alerts.set(alertId, { ...existing, isRead: 1 });
    }
    return { affectedRows: existing ? 1 : 0 };
  }
  
  return await db.update(alerts).set({ isRead: 1 }).where(eq(alerts.id, alertId));
}

// ============ LLM ANALYSIS FUNCTIONS ============

export async function createLLMAnalysis(analysis: InsertLLMAnalysis) {
  const db = await getDb();
  if (!db) {
    const id = inMemoryStorage.nextId.llmAnalysis++;
    inMemoryStorage.llmAnalysis.set(id, { id, ...analysis, createdAt: new Date() });
    return { insertId: id };
  }
  
  return await db.insert(llmAnalysis).values(analysis);
}

export async function getLLMAnalysisByClientId(clientId: number) {
  const db = await getDb();
  if (!db) {
    return Array.from(inMemoryStorage.llmAnalysis.values())
      .filter(a => a.clientId === clientId)
      .sort((a, b) => b.createdAt - a.createdAt);
  }
  
  return await db.select().from(llmAnalysis)
    .where(eq(llmAnalysis.clientId, clientId))
    .orderBy(desc(llmAnalysis.createdAt));
}

// ============ UTILITY FUNCTIONS ============

export function getAllClients() {
  return Array.from(inMemoryStorage.clients.values());
}

export function clearInMemoryStorage() {
  inMemoryStorage.clients.clear();
  inMemoryStorage.addresses.clear();
  inMemoryStorage.employments.clear();
  inMemoryStorage.creditAccounts.clear();
  inMemoryStorage.creditQueries.clear();
  inMemoryStorage.creditReports.clear();
  inMemoryStorage.documents.clear();
  inMemoryStorage.alerts.clear();
  inMemoryStorage.llmAnalysis.clear();
  inMemoryStorage.users.clear();
  
  Object.keys(inMemoryStorage.nextId).forEach(key => {
    (inMemoryStorage.nextId as any)[key] = 1;
  });
}

export function initializeSampleData() {
  const existingClients = Array.from(inMemoryStorage.clients.values()).filter(c => c.userId === 1);
  
  if (existingClients.length === 0) {
    const sampleClient = {
      id: 1,
      userId: 1,
      nombres: 'JUAN CARLOS',
      apellidoPaterno: 'PEREZ',
      apellidoMaterno: 'GARCIA',
      rfc: 'PEGJ800101ABC',
      curp: 'PEGJ800101HDFRRN09',
      fechaNacimiento: '01011980',
      nacionalidad: 'MX',
      telefono: '5551234567',
      celular: '5559876543',
      email: 'juan@example.com',
      identificacionBuro: 'ID-001',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    inMemoryStorage.clients.set(1, sampleClient);
    inMemoryStorage.nextId.clients = 2;
    console.log('[Database] Sample client initialized with Buro requirements');
  }
}

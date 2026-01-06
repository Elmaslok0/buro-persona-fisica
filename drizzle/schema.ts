import { integer, pgEnum, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";

/**
 * Core user table backing auth flow.
 */
export const roleEnum = pgEnum("role", ["user", "admin"]);

export const users = pgTable("users", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: roleEnum("role").default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Clients table - Personas físicas con actividad empresarial
 */
export const clients = pgTable("clients", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: integer("userId").notNull(),
  
  // Datos personales
  nombres: varchar("nombres", { length: 100 }),
  apellidoPaterno: varchar("apellidoPaterno", { length: 100 }),
  apellidoMaterno: varchar("apellidoMaterno", { length: 100 }),
  rfc: varchar("rfc", { length: 13 }),
  curp: varchar("curp", { length: 18 }),
  fechaNacimiento: varchar("fechaNacimiento", { length: 10 }),
  nacionalidad: varchar("nacionalidad", { length: 2 }),
  
  // Datos de contacto
  telefono: varchar("telefono", { length: 20 }),
  celular: varchar("celular", { length: 20 }),
  email: varchar("email", { length: 320 }),
  
  // Identificación Buró
  identificacionBuro: varchar("identificacionBuro", { length: 50 }),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Client = typeof clients.$inferSelect;
export type InsertClient = typeof clients.$inferInsert;

/**
 * Addresses table - Domicilios de clientes
 */
export const addresses = pgTable("addresses", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  clientId: integer("clientId").notNull(),
  
  direccion1: varchar("direccion1", { length: 200 }),
  direccion2: varchar("direccion2", { length: 200 }),
  coloniaPoblacion: varchar("coloniaPoblacion", { length: 100 }),
  delegacionMunicipio: varchar("delegacionMunicipio", { length: 100 }),
  ciudad: varchar("ciudad", { length: 100 }),
  estado: varchar("estado", { length: 50 }),
  cp: varchar("cp", { length: 10 }),
  codPais: varchar("codPais", { length: 2 }),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Address = typeof addresses.$inferSelect;
export type InsertAddress = typeof addresses.$inferInsert;

/**
 * Employments table - Empleos de clientes
 */
export const employments = pgTable("employments", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  clientId: integer("clientId").notNull(),
  
  nombreEmpresa: varchar("nombreEmpresa", { length: 200 }),
  direccion: varchar("direccion", { length: 200 }),
  colonia: varchar("colonia", { length: 100 }),
  delegacionMunicipio: varchar("delegacionMunicipio", { length: 100 }),
  ciudad: varchar("ciudad", { length: 100 }),
  estado: varchar("estado", { length: 50 }),
  cp: varchar("cp", { length: 10 }),
  telefono: varchar("telefono", { length: 20 }),
  extension: varchar("extension", { length: 10 }),
  puesto: varchar("puesto", { length: 100 }),
  fechaContratacion: varchar("fechaContratacion", { length: 10 }),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Employment = typeof employments.$inferSelect;
export type InsertEmployment = typeof employments.$inferInsert;

/**
 * Credit Accounts table - Cuentas de crédito
 */
export const creditAccounts = pgTable("credit_accounts", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  clientId: integer("clientId").notNull(),
  
  numeroCuenta: varchar("numeroCuenta", { length: 50 }),
  tipoCredito: varchar("tipoCredito", { length: 50 }),
  otorgante: varchar("otorgante", { length: 200 }),
  saldoActual: varchar("saldoActual", { length: 20 }),
  limiteCredito: varchar("limiteCredito", { length: 20 }),
  mop: varchar("mop", { length: 10 }),
  fechaApertura: varchar("fechaApertura", { length: 10 }),
  fechaCierre: varchar("fechaCierre", { length: 10 }),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type CreditAccount = typeof creditAccounts.$inferSelect;
export type InsertCreditAccount = typeof creditAccounts.$inferInsert;

/**
 * Credit Queries table - Consultas realizadas
 */
export const creditQueries = pgTable("credit_queries", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  clientId: integer("clientId").notNull(),
  
  tipoConsulta: varchar("tipoConsulta", { length: 50 }),
  otorgante: varchar("otorgante", { length: 200 }),
  fechaConsulta: varchar("fechaConsulta", { length: 10 }),
  folioConsulta: varchar("folioConsulta", { length: 100 }),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type CreditQuery = typeof creditQueries.$inferSelect;
export type InsertCreditQuery = typeof creditQueries.$inferInsert;

/**
 * Credit Reports table - Reportes generados
 */
export const creditReports = pgTable("credit_reports", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  clientId: integer("clientId").notNull(),
  
  tipoReporte: varchar("tipoReporte", { length: 50 }),
  folioConsulta: varchar("folioConsulta", { length: 100 }),
  respuestaApi: text("respuestaApi"),
  analisisLlm: text("analisisLlm"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type CreditReport = typeof creditReports.$inferSelect;
export type InsertCreditReport = typeof creditReports.$inferInsert;

/**
 * Documents table - Documentos almacenados en S3
 */
export const documents = pgTable("documents", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  clientId: integer("clientId").notNull(),
  
  tipoDocumento: varchar("tipoDocumento", { length: 50 }),
  nombreArchivo: varchar("nombreArchivo", { length: 200 }),
  s3Key: varchar("s3Key", { length: 500 }),
  s3Url: varchar("s3Url", { length: 1000 }),
  mimeType: varchar("mimeType", { length: 100 }),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Document = typeof documents.$inferSelect;
export type InsertDocument = typeof documents.$inferInsert;

/**
 * Alerts table - Alertas de monitoreo
 */
export const alerts = pgTable("alerts", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  clientId: integer("clientId").notNull(),
  
  tipoAlerta: varchar("tipoAlerta", { length: 50 }),
  descripcion: text("descripcion"),
  leida: integer("leida").default(0).notNull(),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Alert = typeof alerts.$inferSelect;
export type InsertAlert = typeof alerts.$inferInsert;

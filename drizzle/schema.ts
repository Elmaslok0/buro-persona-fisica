import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, json } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Clients table - Personas físicas con actividad empresarial
 */
export const clients = mysqlTable("clients", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  
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
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Client = typeof clients.$inferSelect;
export type InsertClient = typeof clients.$inferInsert;

/**
 * Addresses table - Direcciones de clientes
 */
export const addresses = mysqlTable("addresses", {
  id: int("id").autoincrement().primaryKey(),
  clientId: int("clientId").notNull(),
  
  direccion1: varchar("direccion1", { length: 200 }),
  direccion2: varchar("direccion2", { length: 200 }),
  coloniaPoblacion: varchar("coloniaPoblacion", { length: 100 }),
  delegacionMunicipio: varchar("delegacionMunicipio", { length: 100 }),
  ciudad: varchar("ciudad", { length: 100 }),
  estado: varchar("estado", { length: 4 }),
  cp: varchar("cp", { length: 10 }),
  codPais: varchar("codPais", { length: 2 }),
  
  fechaResidencia: varchar("fechaResidencia", { length: 10 }),
  numeroTelefono: varchar("numeroTelefono", { length: 20 }),
  tipoDomicilio: varchar("tipoDomicilio", { length: 1 }),
  tipoAsentamiento: varchar("tipoAsentamiento", { length: 3 }),
  
  isPrimary: int("isPrimary").default(0),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Address = typeof addresses.$inferSelect;
export type InsertAddress = typeof addresses.$inferInsert;

/**
 * Employments table - Datos de empleo
 */
export const employments = mysqlTable("employments", {
  id: int("id").autoincrement().primaryKey(),
  clientId: int("clientId").notNull(),
  
  nombreEmpresa: varchar("nombreEmpresa", { length: 200 }),
  direccion: varchar("direccion", { length: 200 }),
  coloniaPoblacion: varchar("coloniaPoblacion", { length: 100 }),
  delegacionMunicipio: varchar("delegacionMunicipio", { length: 100 }),
  ciudad: varchar("ciudad", { length: 100 }),
  estado: varchar("estado", { length: 4 }),
  cp: varchar("cp", { length: 10 }),
  
  numeroTelefono: varchar("numeroTelefono", { length: 20 }),
  extension: varchar("extension", { length: 10 }),
  fax: varchar("fax", { length: 20 }),
  
  puesto: varchar("puesto", { length: 100 }),
  fechaContratacion: varchar("fechaContratacion", { length: 10 }),
  claveMoneda: varchar("claveMoneda", { length: 3 }),
  salarioMensual: decimal("salarioMensual", { precision: 15, scale: 2 }),
  
  fechaUltimoDiaEmpleo: varchar("fechaUltimoDiaEmpleo", { length: 10 }),
  fechaVerificacionEmpleo: varchar("fechaVerificacionEmpleo", { length: 10 }),
  
  isCurrent: int("isCurrent").default(1),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Employment = typeof employments.$inferSelect;
export type InsertEmployment = typeof employments.$inferInsert;

/**
 * Credit Accounts table - Cuentas de crédito
 */
export const creditAccounts = mysqlTable("credit_accounts", {
  id: int("id").autoincrement().primaryKey(),
  clientId: int("clientId").notNull(),
  
  claveOtorgante: varchar("claveOtorgante", { length: 20 }),
  nombreOtorgante: varchar("nombreOtorgante", { length: 200 }),
  numeroCuentaActual: varchar("numeroCuentaActual", { length: 50 }),
  
  tipoContrato: varchar("tipoContrato", { length: 4 }),
  tipoCuenta: varchar("tipoCuenta", { length: 1 }),
  tipoResponsabilidad: varchar("tipoResponsabilidad", { length: 1 }),
  
  claveUnidadMonetaria: varchar("claveUnidadMonetaria", { length: 3 }),
  limiteCredito: decimal("limiteCredito", { precision: 15, scale: 2 }),
  creditoMaximo: decimal("creditoMaximo", { precision: 15, scale: 2 }),
  saldoActual: decimal("saldoActual", { precision: 15, scale: 2 }),
  saldoVencido: decimal("saldoVencido", { precision: 15, scale: 2 }),
  montoPagar: decimal("montoPagar", { precision: 15, scale: 2 }),
  montoUltimoPago: decimal("montoUltimoPago", { precision: 15, scale: 2 }),
  
  fechaAperturaCuenta: varchar("fechaAperturaCuenta", { length: 10 }),
  fechaCierreCuenta: varchar("fechaCierreCuenta", { length: 10 }),
  fechaUltimoPago: varchar("fechaUltimoPago", { length: 10 }),
  fechaUltimaCompra: varchar("fechaUltimaCompra", { length: 10 }),
  fechaReporte: varchar("fechaReporte", { length: 10 }),
  fechaActualizacion: varchar("fechaActualizacion", { length: 10 }),
  
  formaPagoActual: varchar("formaPagoActual", { length: 3 }),
  frecuenciaPagos: varchar("frecuenciaPagos", { length: 1 }),
  numeroPagos: int("numeroPagos"),
  numeroPagosVencidos: int("numeroPagosVencidos"),
  
  historicoPagos: text("historicoPagos"),
  mopHistoricoMorosidadMasGrave: varchar("mopHistoricoMorosidadMasGrave", { length: 3 }),
  fechaHistoricaMorosidadMasGrave: varchar("fechaHistoricaMorosidadMasGrave", { length: 10 }),
  
  totalPagosReportados: int("totalPagosReportados"),
  totalPagosCalificadosMOP2: int("totalPagosCalificadosMOP2"),
  totalPagosCalificadosMOP3: int("totalPagosCalificadosMOP3"),
  totalPagosCalificadosMOP4: int("totalPagosCalificadosMOP4"),
  totalPagosCalificadosMOP5: int("totalPagosCalificadosMOP5"),
  
  claveObservacion: varchar("claveObservacion", { length: 10 }),
  registroImpugnado: varchar("registroImpugnado", { length: 1 }),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CreditAccount = typeof creditAccounts.$inferSelect;
export type InsertCreditAccount = typeof creditAccounts.$inferInsert;

/**
 * Credit Queries table - Consultas realizadas
 */
export const creditQueries = mysqlTable("credit_queries", {
  id: int("id").autoincrement().primaryKey(),
  clientId: int("clientId").notNull(),
  
  claveOtorgante: varchar("claveOtorgante", { length: 20 }),
  nombreOtorgante: varchar("nombreOtorgante", { length: 200 }),
  telefonoOtorgante: varchar("telefonoOtorgante", { length: 20 }),
  
  fechaConsulta: varchar("fechaConsulta", { length: 10 }),
  tipoContrato: varchar("tipoContrato", { length: 4 }),
  claveUnidadMonetaria: varchar("claveUnidadMonetaria", { length: 3 }),
  importeContrato: decimal("importeContrato", { precision: 15, scale: 2 }),
  
  indicadorTipoResponsabilidad: varchar("indicadorTipoResponsabilidad", { length: 1 }),
  tipoConsulta: varchar("tipoConsulta", { length: 10 }),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type CreditQuery = typeof creditQueries.$inferSelect;
export type InsertCreditQuery = typeof creditQueries.$inferInsert;

/**
 * Credit Reports table - Reportes generados
 */
export const creditReports = mysqlTable("credit_reports", {
  id: int("id").autoincrement().primaryKey(),
  clientId: int("clientId").notNull(),
  
  reportType: varchar("reportType", { length: 50 }).notNull(), // autenticador, reporte-de-credito, informe-buro, monitor, prospector, estimador-ingresos
  
  // Datos del reporte
  folioConsulta: varchar("folioConsulta", { length: 50 }),
  folioConsultaOtorgante: varchar("folioConsultaOtorgante", { length: 50 }),
  claveOtorgante: varchar("claveOtorgante", { length: 20 }),
  
  // Respuesta completa del API
  responseData: json("responseData"),
  
  // Archivo PDF generado
  pdfUrl: varchar("pdfUrl", { length: 500 }),
  pdfKey: varchar("pdfKey", { length: 500 }),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type CreditReport = typeof creditReports.$inferSelect;
export type InsertCreditReport = typeof creditReports.$inferInsert;

/**
 * Documents table - Documentos almacenados en S3
 */
export const documents = mysqlTable("documents", {
  id: int("id").autoincrement().primaryKey(),
  clientId: int("clientId").notNull(),
  
  documentType: varchar("documentType", { length: 50 }).notNull(), // INE, comprobante_domicilio, estado_cuenta, etc
  fileName: varchar("fileName", { length: 255 }).notNull(),
  fileKey: varchar("fileKey", { length: 500 }).notNull(),
  fileUrl: varchar("fileUrl", { length: 500 }).notNull(),
  mimeType: varchar("mimeType", { length: 100 }),
  fileSize: int("fileSize"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Document = typeof documents.$inferSelect;
export type InsertDocument = typeof documents.$inferInsert;

/**
 * Alerts table - Alertas de monitoreo
 */
export const alerts = mysqlTable("alerts", {
  id: int("id").autoincrement().primaryKey(),
  clientId: int("clientId").notNull(),
  
  alertType: varchar("alertType", { length: 50 }).notNull(), // nueva_consulta, cambio_saldo, nueva_cuenta, etc
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  severity: mysqlEnum("severity", ["info", "warning", "critical"]).default("info").notNull(),
  
  isRead: int("isRead").default(0),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Alert = typeof alerts.$inferSelect;
export type InsertAlert = typeof alerts.$inferInsert;

/**
 * LLM Analysis table - Análisis inteligente generado por LLM
 */
export const llmAnalysis = mysqlTable("llm_analysis", {
  id: int("id").autoincrement().primaryKey(),
  clientId: int("clientId").notNull(),
  
  analysisType: varchar("analysisType", { length: 50 }).notNull(), // credit_risk, recommendations, score_improvement
  analysisData: json("analysisData"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type LLMAnalysis = typeof llmAnalysis.$inferSelect;
export type InsertLLMAnalysis = typeof llmAnalysis.$inferInsert;

import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { initializeApiClient, getApiClient } from "./services/apiClient";
import * as prospectorModule from "./modules/prospector";
import * as monitorModule from "./modules/monitor";
import * as estimadorIngresosModule from "./modules/estimadorIngresos";
import * as reporteCreditoModule from "./modules/reporteCredito";
import * as informeBuroModule from "./modules/informeBuro";
import { authenticate, isTokenValid, getCurrentToken } from "./config/autenticador";

// Schema para Persona
const PersonaSchema = z.object({
  nombre: z.object({
    apellidoPaterno: z.string().optional(),
    apellidoMaterno: z.string().optional(),
    nombre: z.string().optional(),
  }).optional(),
  direccion: z.object({
    ciudad: z.string().optional(),
    codPais: z.string().optional(),
    codigoPostal: z.string().optional(),
    calle: z.string().optional(),
    numero: z.string().optional(),
  }).optional(),
  empleo: z.object({
    empresa: z.string().optional(),
    puesto: z.string().optional(),
    antiguedad: z.string().optional(),
  }).optional(),
  telefonoContacto: z.string().optional(),
});

// Inicializar cliente de API si no está inicializado
function ensureApiClientInitialized() {
  try {
    getApiClient();
  } catch {
    const config = {
      baseURL: process.env.BURO_API_URL || 'https://api.burodecredito.com.mx:4431/devpf',
      apiKey: process.env.BURO_API_KEY || '',
      apiSecret: process.env.BURO_API_SECRET || '',
      timeout: 30000,
    };
    initializeApiClient(config);
  }
}

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Módulos del Buró de Crédito
  buro: router({
    // Autenticación
    authenticate: publicProcedure
      .input(PersonaSchema)
      .mutation(async ({ input }) => {
        ensureApiClientInitialized();
        const result = await authenticate(input);
        return result;
      }),

    // Verificar token válido
    isTokenValid: publicProcedure.query(() => {
      ensureApiClientInitialized();
      return { valid: isTokenValid() };
    }),

    // Prospector - Prospección de clientes
    prospector: publicProcedure
      .input(PersonaSchema)
      .mutation(async ({ input }) => {
        ensureApiClientInitialized();
        const result = await prospectorModule.prospectClient(input);
        return result;
      }),

    // Monitor - Monitoreo de crédito
    monitor: publicProcedure
      .input(PersonaSchema)
      .mutation(async ({ input }) => {
        ensureApiClientInitialized();
        const result = await monitorModule.monitorCredit(input);
        return result;
      }),

    // Estimador de Ingresos
    estimadorIngresos: publicProcedure
      .input(PersonaSchema)
      .mutation(async ({ input }) => {
        ensureApiClientInitialized();
        const result = await estimadorIngresosModule.estimateIncome(input);
        return result;
      }),

    // Reporte de Crédito
    reporteCredito: publicProcedure
      .input(PersonaSchema)
      .mutation(async ({ input }) => {
        ensureApiClientInitialized();
        const result = await reporteCreditoModule.generateCreditReport(input);
        return result;
      }),

    // Informe Buró
    informeBuro: publicProcedure
      .input(PersonaSchema)
      .mutation(async ({ input }) => {
        ensureApiClientInitialized();
        const result = await informeBuroModule.getBuroReport(input);
        return result;
      }),
  }),
});

export type AppRouter = typeof appRouter;

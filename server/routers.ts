import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { buroClient } from "./buroClient";

export const appRouter = router({
  system: systemRouter,
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(() => {
      return { success: true } as const;
    }),
  }),

  // ============ CLIENT MANAGEMENT ============
  clientManagement: router({
    create: protectedProcedure
      .input(z.object({
        nombres: z.string(),
        apellidoPaterno: z.string(),
        apellidoMaterno: z.string().optional(),
        rfc: z.string().optional(),
        curp: z.string().optional(),
        fechaNacimiento: z.string().optional(),
        nacionalidad: z.string().optional(),
        telefono: z.string().optional(),
        celular: z.string().optional(),
        email: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.createClient({
          userId: ctx.user.id,
          ...input,
        });
        return { success: true };
      }),

    list: protectedProcedure
      .query(async ({ ctx }) => {
        return await db.getClientsByUserId(ctx.user.id);
      }),

    getById: protectedProcedure
      .input(z.object({ clientId: z.number() }))
      .query(async ({ input }) => {
        return await db.getClientById(input.clientId);
      }),

    update: protectedProcedure
      .input(z.object({
        clientId: z.number(),
        data: z.object({
          nombres: z.string().optional(),
          apellidoPaterno: z.string().optional(),
          apellidoMaterno: z.string().optional(),
          rfc: z.string().optional(),
          curp: z.string().optional(),
          fechaNacimiento: z.string().optional(),
          nacionalidad: z.string().optional(),
          telefono: z.string().optional(),
          celular: z.string().optional(),
          email: z.string().optional(),
        }),
      }))
      .mutation(async ({ input }) => {
        await db.updateClient(input.clientId, input.data);
        return { success: true };
      }),
  }),

  // ============ BURÓ DE CRÉDITO MODULES ============
  buro: router({
    // Test de conexión con Buró de Crédito
    testConnection: protectedProcedure
      .query(async () => {
        return await buroClient.testConnection();
      }),

    // Autenticador - Autenticación con preguntas de seguridad
    autenticador: protectedProcedure
      .input(z.object({
        clientId: z.number(),
        persona: z.object({
          primerNombre: z.string(),
          apellidoPaterno: z.string(),
          apellidoMaterno: z.string().optional(),
          fechaNacimiento: z.string(),
          rfc: z.string().optional(),
          curp: z.string().optional(),
          nacionalidad: z.string().optional(),
          domicilio: z.object({
            direccion1: z.string(),
            coloniaPoblacion: z.string(),
            delegacionMunicipio: z.string(),
            ciudad: z.string(),
            estado: z.string(),
            cp: z.string(),
            codPais: z.string().default("MX"),
          }),
        }),
        autenticacion: z.object({
          ejercidoCreditoAutomotriz: z.string(),
          ejercidoCreditoHipotecario: z.string(),
          tarjetaCredito: z.string(),
          tipoReporte: z.string().default("RCN"),
          tipoSalidaAU: z.string().default("4"),
          referenciaOperador: z.string().optional(),
        }),
      }))
      .mutation(async ({ input }) => {
        const requestData = {
          consulta: {
            persona: input.persona,
            autenticacion: input.autenticacion,
          },
        };

        const response = await buroClient.autenticador(requestData);

        // Guardar reporte
        await db.createCreditReport({
          clientId: input.clientId,
          reportType: 'autenticador',
          responseData: response,
        });

        return response;
      }),

    // Reporte de Crédito - Reporte completo
    reporteDeCredito: protectedProcedure
      .input(z.object({
        clientId: z.number(),
        persona: z.object({
          primerNombre: z.string(),
          apellidoPaterno: z.string(),
          apellidoMaterno: z.string().optional(),
          fechaNacimiento: z.string(),
          rfc: z.string().optional(),
          curp: z.string().optional(),
          nacionalidad: z.string().optional(),
          domicilio: z.object({
            direccion1: z.string(),
            coloniaPoblacion: z.string(),
            delegacionMunicipio: z.string(),
            ciudad: z.string(),
            estado: z.string(),
            cp: z.string(),
            codPais: z.string().default("MX"),
          }),
        }),
        encabezado: z.object({
          claveOtorgante: z.string(),
          nombreOtorgante: z.string(),
          folioConsulta: z.string().optional(),
          folioConsultaOtorgante: z.string().optional(),
          claveUnidadMonetaria: z.string().default("MX"),
          tipoContrato: z.string().optional(),
          importeContrato: z.string().optional(),
          tipoReporte: z.string().default("RCN"),
        }),
      }))
      .mutation(async ({ input }) => {
        const requestData = {
          consulta: {
            persona: input.persona,
            encabezado: input.encabezado,
          },
        };

        const response = await buroClient.reporteDeCredito(requestData);

        // Guardar reporte
        await db.createCreditReport({
          clientId: input.clientId,
          reportType: 'reporte-de-credito',
          folioConsulta: input.encabezado.folioConsulta,
          folioConsultaOtorgante: input.encabezado.folioConsultaOtorgante,
          claveOtorgante: input.encabezado.claveOtorgante,
          responseData: response,
        });

        return response;
      }),

    // Informe Buró - Informe detallado
    informeBuro: protectedProcedure
      .input(z.object({
        clientId: z.number(),
        persona: z.object({
          primerNombre: z.string(),
          apellidoPaterno: z.string(),
          apellidoMaterno: z.string().optional(),
          fechaNacimiento: z.string(),
          rfc: z.string().optional(),
          curp: z.string().optional(),
          nacionalidad: z.string().optional(),
          domicilio: z.object({
            direccion1: z.string(),
            coloniaPoblacion: z.string(),
            delegacionMunicipio: z.string(),
            ciudad: z.string(),
            estado: z.string(),
            cp: z.string(),
            codPais: z.string().default("MX"),
          }),
        }),
        encabezado: z.object({
          claveOtorgante: z.string(),
          nombreOtorgante: z.string(),
          folioConsulta: z.string().optional(),
          folioConsultaOtorgante: z.string().optional(),
          claveUnidadMonetaria: z.string().default("MX"),
        }),
      }))
      .mutation(async ({ input }) => {
        const requestData = {
          consulta: {
            persona: input.persona,
            encabezado: input.encabezado,
          },
        };

        const response = await buroClient.informeBuro(requestData);

        await db.createCreditReport({
          clientId: input.clientId,
          reportType: 'informe-buro',
          folioConsulta: input.encabezado.folioConsulta,
          folioConsultaOtorgante: input.encabezado.folioConsultaOtorgante,
          claveOtorgante: input.encabezado.claveOtorgante,
          responseData: response,
        });

        return response;
      }),

    // Monitor - Monitoreo continuo
    monitor: protectedProcedure
      .input(z.object({
        clientId: z.number(),
        persona: z.object({
          primerNombre: z.string(),
          apellidoPaterno: z.string(),
          apellidoMaterno: z.string().optional(),
          fechaNacimiento: z.string(),
          rfc: z.string().optional(),
          curp: z.string().optional(),
          nacionalidad: z.string().optional(),
          domicilio: z.object({
            direccion1: z.string(),
            coloniaPoblacion: z.string(),
            delegacionMunicipio: z.string(),
            ciudad: z.string(),
            estado: z.string(),
            cp: z.string(),
            codPais: z.string().default("MX"),
          }),
        }),
        encabezado: z.object({
          claveOtorgante: z.string(),
          nombreOtorgante: z.string(),
          folioConsulta: z.string().optional(),
        }),
      }))
      .mutation(async ({ input }) => {
        const requestData = {
          consulta: {
            persona: input.persona,
            encabezado: input.encabezado,
          },
        };

        const response = await buroClient.monitor(requestData);

        await db.createCreditReport({
          clientId: input.clientId,
          reportType: 'monitor',
          responseData: response,
        });

        return response;
      }),

    // Prospector - Análisis de prospección
    prospector: protectedProcedure
      .input(z.object({
        clientId: z.number(),
        persona: z.object({
          primerNombre: z.string(),
          apellidoPaterno: z.string(),
          apellidoMaterno: z.string().optional(),
          fechaNacimiento: z.string(),
          rfc: z.string().optional(),
          curp: z.string().optional(),
          nacionalidad: z.string().optional(),
          domicilio: z.object({
            direccion1: z.string(),
            coloniaPoblacion: z.string(),
            delegacionMunicipio: z.string(),
            ciudad: z.string(),
            estado: z.string(),
            cp: z.string(),
            codPais: z.string().default("MX"),
          }),
        }),
        encabezado: z.object({
          claveOtorgante: z.string(),
          nombreOtorgante: z.string(),
          folioConsulta: z.string().optional(),
        }),
      }))
      .mutation(async ({ input }) => {
        const requestData = {
          consulta: {
            persona: input.persona,
            encabezado: input.encabezado,
          },
        };

        const response = await buroClient.prospector(requestData);

        await db.createCreditReport({
          clientId: input.clientId,
          reportType: 'prospector',
          responseData: response,
        });

        return response;
      }),

    // Estimador de Ingresos
    estimadorIngresos: protectedProcedure
      .input(z.object({
        clientId: z.number(),
        persona: z.object({
          primerNombre: z.string(),
          apellidoPaterno: z.string(),
          apellidoMaterno: z.string().optional(),
          fechaNacimiento: z.string(),
          rfc: z.string().optional(),
          curp: z.string().optional(),
          nacionalidad: z.string().optional(),
          domicilio: z.object({
            direccion1: z.string(),
            coloniaPoblacion: z.string(),
            delegacionMunicipio: z.string(),
            ciudad: z.string(),
            estado: z.string(),
            cp: z.string(),
            codPais: z.string().default("MX"),
          }),
        }),
        encabezado: z.object({
          claveOtorgante: z.string(),
          nombreOtorgante: z.string(),
          folioConsulta: z.string().optional(),
        }),
      }))
      .mutation(async ({ input }) => {
        const requestData = {
          consulta: {
            persona: input.persona,
            encabezado: input.encabezado,
          },
        };

        const response = await buroClient.estimadorIngresos(requestData);

        await db.createCreditReport({
          clientId: input.clientId,
          reportType: 'estimador-ingresos',
          responseData: response,
        });

        return response;
      }),

    // E-Score - Puntuación de crédito electrónica
    eScore: protectedProcedure
      .input(z.object({
        clientId: z.number(),
        persona: z.object({
          primerNombre: z.string(),
          apellidoPaterno: z.string(),
          apellidoMaterno: z.string().optional(),
          fechaNacimiento: z.string(),
          rfc: z.string().optional(),
          curp: z.string().optional(),
          nacionalidad: z.string().optional(),
        }),
      }))
      .mutation(async ({ input }) => {
        // Consultar E-Score a través del cliente de Buró
        const eScoreData = await buroClient.eScore({
          persona: {
            nombre: {
              primerNombre: input.persona.primerNombre,
              apellidoPaterno: input.persona.apellidoPaterno,
              apellidoMaterno: input.persona.apellidoMaterno || '',
            },
            fechaNacimiento: input.persona.fechaNacimiento,
            rfc: input.persona.rfc,
            curp: input.persona.curp,
          }
        });

        // Guardar reporte
        await db.createCreditReport({
          clientId: input.clientId,
          reportType: 'e-score',
          responseData: eScoreData,
        });

        return eScoreData;
      }),
  }),

  // ============ CREDIT REPORTS ============
  creditReports: router({
    getByClientId: protectedProcedure
      .input(z.object({ clientId: z.number() }))
      .query(async ({ input }) => {
        return await db.getCreditReportsByClientId(input.clientId);
      }),

    getById: protectedProcedure
      .input(z.object({ reportId: z.number() }))
      .query(async ({ input }) => {
        return await db.getCreditReportById(input.reportId);
      }),
  }),
});

export type AppRouter = typeof appRouter;

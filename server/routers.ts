import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { buroClient } from "./buroClient";
import { storagePut } from "./storage";
import { invokeLLM } from "./_core/llm";
import { nanoid } from "nanoid";

export const appRouter = router({
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
          tipoReporte: 'autenticador',
          respuestaApi: JSON.stringify(response),
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
          tipoReporte: 'reporte-de-credito',
          folioConsulta: input.encabezado.folioConsulta,
          respuestaApi: JSON.stringify(response),
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
          tipoReporte: 'informe-buro',
          folioConsulta: input.encabezado.folioConsulta,
          respuestaApi: JSON.stringify(response),
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
          tipoReporte: 'monitor',
          respuestaApi: JSON.stringify(response),
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
          tipoReporte: 'prospector',
          respuestaApi: JSON.stringify(response),
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
          tipoReporte: 'estimador-ingresos',
          respuestaApi: JSON.stringify(response),
        });

        return response;
      }),
  }),

  // ============ REPORTS ============
  reports: router({
    list: protectedProcedure
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

  // ============ DOCUMENTS ============
  documents: router({
    upload: protectedProcedure
      .input(z.object({
        clientId: z.number(),
        documentType: z.string(),
        fileName: z.string(),
        fileData: z.string(), // base64
        mimeType: z.string(),
      }))
      .mutation(async ({ input }) => {
        const buffer = Buffer.from(input.fileData, 'base64');
        const fileKey = `clients/${input.clientId}/documents/${nanoid()}-${input.fileName}`;
        
        const { url } = await storagePut(fileKey, buffer, input.mimeType);

        await db.createDocument({
          clientId: input.clientId,
          tipoDocumento: input.documentType,
          nombreArchivo: input.fileName,
          s3Key: fileKey,
          s3Url: url,
          mimeType: input.mimeType,
        });

        return { success: true, url };
      }),

    list: protectedProcedure
      .input(z.object({ clientId: z.number() }))
      .query(async ({ input }) => {
        return await db.getDocumentsByClientId(input.clientId);
      }),
  }),

  // ============ ALERTS ============
  alerts: router({
    list: protectedProcedure
      .input(z.object({ clientId: z.number() }))
      .query(async ({ input }) => {
        return await db.getAlertsByClientId(input.clientId);
      }),

    markAsRead: protectedProcedure
      .input(z.object({ alertId: z.number() }))
      .mutation(async ({ input }) => {
        await db.markAlertAsRead(input.alertId);
        return { success: true };
      }),
  }),

  // ============ LLM ANALYSIS ============
  analysis: router({
    generate: protectedProcedure
      .input(z.object({
        clientId: z.number(),
        analysisType: z.enum(['credit_risk', 'recommendations', 'score_improvement']),
      }))
      .mutation(async ({ input }) => {
        // Obtener datos del cliente y reportes
        const client = await db.getClientById(input.clientId);
        const reports = await db.getCreditReportsByClientId(input.clientId);
        const accounts = await db.getCreditAccountsByClientId(input.clientId);

        let prompt = '';
        
        if (input.analysisType === 'credit_risk') {
          prompt = `Analiza el riesgo crediticio del siguiente cliente basándote en su historial:
          
Cliente: ${JSON.stringify(client)}
Cuentas de crédito: ${JSON.stringify(accounts)}

Proporciona un análisis detallado del riesgo crediticio, incluyendo:
1. Nivel de riesgo (Bajo, Medio, Alto)
2. Factores de riesgo principales
3. Comportamiento de pago histórico
4. Recomendaciones para mitigar riesgos`;
        } else if (input.analysisType === 'recommendations') {
          prompt = `Genera recomendaciones personalizadas para el siguiente cliente:
          
Cliente: ${JSON.stringify(client)}
Cuentas de crédito: ${JSON.stringify(accounts)}

Proporciona recomendaciones sobre:
1. Productos crediticios adecuados
2. Límites de crédito sugeridos
3. Estrategias de mejora financiera
4. Oportunidades de consolidación`;
        } else {
          prompt = `Analiza cómo este cliente puede mejorar su score crediticio:
          
Cliente: ${JSON.stringify(client)}
Cuentas de crédito: ${JSON.stringify(accounts)}

Proporciona un plan de acción con:
1. Acciones inmediatas (0-3 meses)
2. Acciones a mediano plazo (3-12 meses)
3. Estrategias a largo plazo (1+ años)
4. Impacto estimado en el score`;
        }

        const llmResponse = await invokeLLM({
          messages: [
            { role: 'system', content: 'Eres un experto analista de crédito que proporciona análisis detallados y recomendaciones basadas en datos financieros.' },
            { role: 'user', content: prompt },
          ],
        });

        const analysisData = {
          content: llmResponse.choices[0]?.message?.content || '',
          timestamp: new Date().toISOString(),
        };

        // await db.createLLMAnalysis({
        //   clientId: input.clientId,
        //   analysisType: input.analysisType,
        //   analysisData,
        // });

        return analysisData;
      }),

    list: protectedProcedure
      .input(z.object({ clientId: z.number() }))
      .query(async ({ input }) => {
        // const analyses = await db.getLLMAnalysisByClientId(input.clientId);
        const analyses: any[] = [];
        return analyses;
      }),
  }),
});

export type AppRouter = typeof appRouter;

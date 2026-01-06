import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return { ctx };
}

describe("clientManagement", () => {
  it("should create a new client", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.clientManagement.create({
      nombres: "Juan",
      apellidoPaterno: "Pérez",
      apellidoMaterno: "García",
      rfc: "PEGJ800101ABC",
      curp: "PEGJ800101HDFRRL01",
      fechaNacimiento: "1980-01-01",
      nacionalidad: "MX",
      telefono: "5551234567",
      celular: "5559876543",
      email: "juan.perez@example.com",
    });

    expect(result).toEqual({ success: true });
  });

  it("should list clients for authenticated user", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const clients = await caller.clientManagement.list();

    expect(Array.isArray(clients)).toBe(true);
  });
});

describe("buro modules", () => {
  it("should have autenticador endpoint available", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // Verificar que el endpoint existe
    expect(caller.buro.autenticador).toBeDefined();
  });

  it("should have reporteDeCredito endpoint available", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    expect(caller.buro.reporteDeCredito).toBeDefined();
  });

  it("should have informeBuro endpoint available", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    expect(caller.buro.informeBuro).toBeDefined();
  });

  it("should have monitor endpoint available", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    expect(caller.buro.monitor).toBeDefined();
  });

  it("should have prospector endpoint available", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    expect(caller.buro.prospector).toBeDefined();
  });

  it("should have estimadorIngresos endpoint available", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    expect(caller.buro.estimadorIngresos).toBeDefined();
  });
});

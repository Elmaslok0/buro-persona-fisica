import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

// Usuario por defecto para el panel (sin OAuth externo)
const defaultUser: User = {
  id: 1,
  openId: 'panel-user',
  name: 'Usuario Panel',
  email: null,
  role: 'admin',
  loginMethod: 'local',
  lastSignedIn: new Date(),
  createdAt: new Date(),
};

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  // Usar usuario por defecto - no requiere OAuth externo
  return {
    req: opts.req,
    res: opts.res,
    user: defaultUser,
  };
}

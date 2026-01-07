import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import type { TrpcContext } from "./context";

const t = initTRPC.context<TrpcContext>().create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;

// Procedimiento protegido - ahora funciona sin OAuth externo
// Para producción, se puede implementar autenticación básica o JWT local
const requireUser = t.middleware(async opts => {
  const { ctx, next } = opts;

  // Por ahora, permitir acceso sin autenticación OAuth
  // El usuario se puede crear automáticamente o usar un usuario por defecto
  const defaultUser = ctx.user || {
    id: 1,
    openId: 'default-user',
    name: 'Usuario Panel',
    email: null,
    role: 'admin',
    loginMethod: 'local',
    lastSignedIn: new Date(),
    createdAt: new Date(),
  };

  return next({
    ctx: {
      ...ctx,
      user: defaultUser,
    },
  });
});

export const protectedProcedure = t.procedure.use(requireUser);

export const adminProcedure = t.procedure.use(
  t.middleware(async opts => {
    const { ctx, next } = opts;

    // Permitir acceso admin por defecto
    const defaultUser = ctx.user || {
      id: 1,
      openId: 'default-user',
      name: 'Usuario Panel',
      email: null,
      role: 'admin',
      loginMethod: 'local',
      lastSignedIn: new Date(),
      createdAt: new Date(),
    };

    return next({
      ctx: {
        ...ctx,
        user: defaultUser,
      },
    });
  }),
);

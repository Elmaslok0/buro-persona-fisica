import express, { type Express } from "express";
import fs from "fs";
import { type Server } from "http";
import { nanoid } from "nanoid";
import path from "path";
import { createServer as createViteServer } from "vite";
import viteConfig from "../../vite.config";

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "../..",
        "client",
        "index.html"
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  // Intentar múltiples rutas posibles para encontrar los archivos estáticos en Koyeb
  const pathsToTry = [
    path.resolve(process.cwd(), "dist", "public"),
    path.resolve(process.cwd(), "public"),
    path.resolve(import.meta.dirname, "public"),
    path.resolve(import.meta.dirname, "..", "public"),
    path.resolve(import.meta.dirname, "..", "dist", "public"),
  ];

  let finalPath = "";
  for (const p of pathsToTry) {
    if (fs.existsSync(path.resolve(p, "index.html"))) {
      finalPath = p;
      break;
    }
  }

  if (!finalPath) {
    console.error("[Static] ERROR: No se encontró index.html en ninguna de las rutas probadas:", pathsToTry);
    // Fallback al primer path por si acaso
    finalPath = pathsToTry[0];
  }

  console.log(`[Static] Sirviendo archivos desde: ${finalPath}`);

  app.use(express.static(finalPath));

  // IMPORTANTE: Para que React Router funcione (SPA), cualquier ruta que no sea un archivo
  // debe devolver el index.html
  app.get("*", (req, res) => {
    // No aplicar a rutas de la API o tRPC
    if (req.path.startsWith('/api') || req.path.startsWith('/trpc')) {
      return res.status(404).json({ message: "API route not found" });
    }
    
    const indexPath = path.resolve(finalPath, "index.html");
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).send(`Frontend build not found at ${indexPath}. Please check build logs.`);
    }
  });
}

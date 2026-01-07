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
  // En Koyeb/Producción, los archivos están en dist/public relativo a la raíz
  // o en ./public relativo a donde se ejecuta el servidor
  const distPath = path.resolve(process.cwd(), "dist", "public");
  const fallbackPath = path.resolve(process.cwd(), "public");
  
  const finalPath = fs.existsSync(distPath) ? distPath : fallbackPath;

  console.log(`[Static] Sirviendo archivos desde: ${finalPath}`);

  app.use(express.static(finalPath));

  // IMPORTANTE: Para que React Router funcione, cualquier ruta que no sea un archivo
  // debe devolver el index.html
  app.get("*", (req, res) => {
    // No aplicar a rutas de la API
    if (req.path.startsWith('/api')) {
      return res.status(404).json({ message: "API route not found" });
    }
    
    const indexPath = path.resolve(finalPath, "index.html");
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).send("Frontend build not found. Please run pnpm build.");
    }
  });
}

export const ENV = {
  appId: process.env.VITE_APP_ID ?? "buro-persona-fisica",
  cookieSecret: process.env.JWT_SECRET ?? "default-secret",
  databaseUrl: process.env.DATABASE_URL ?? "",
  oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "https://api.manus.im",
  ownerOpenId: process.env.OWNER_OPEN_ID ?? "admin",
  isProduction: process.env.NODE_ENV === "production",
  
  // Buro de Credito API Configuration
  buroApiBaseUrl: process.env.BURO_API_BASE_URL ?? "https://api.burodecredito.com.mx:4431/devpf",
  buroClientId: process.env.BURO_API_CLIENT_ID ?? "",
  buroClientSecret: process.env.BURO_API_CLIENT_SECRET ?? "",
  buroUsername: process.env.BURO_API_USERNAME ?? "Onsite",
  buroPassword: process.env.BURO_API_PASSWORD ?? "Onsite007$$",
};

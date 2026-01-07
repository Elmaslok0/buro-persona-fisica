export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

// Login URL - ahora usa autenticación local simple
export const getLoginUrl = () => {
  // Redirigir a la página de login local
  return '/login';
};

export const isProduction = process.env.NODE_ENV === 'production';
export const localBackendHost = 'http://localhost:3005';
export const localFrontendHost = 'http://localhost:3001';
export const productionHost = 'https://infochat-production.herokuapp.com';
export const host = isProduction ? productionHost : localFrontendHost;
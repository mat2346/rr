/**
 * Configuracion LOCAL de desarrollo con credenciales reales.
 * Este archivo esta gitignored: NUNCA se versiona.
 *
 * Se inyecta en lugar de environment.ts mediante fileReplacements en angular.json
 * (configuracion "development").
 */
export const environment = {
  production: false,
  graphqlUrl: 'http://localhost:3000/api/graphql',
  ms2Url: 'http://localhost:8000',
  blockchainUrl: 'http://localhost:3001',
  supabase: {
    url: 'https://txeyivfuvkdxyrglmqdr.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR4ZXlpdmZ1dmtkeHlyZ2xtcWRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA4NzUwOTEsImV4cCI6MjA5NjQ1MTA5MX0.KkePV78ktYsK1ND0fKj_OHA1wVB9HMRdzfYNW_dZaY4'
  }
};

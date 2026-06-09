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
    url: 'https://yiyfwfvxdseamnelgetf.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlpeWZ3ZnZ4ZHNlYW1uZWxnZXRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk5NTU4MzAsImV4cCI6MjA5NTUzMTgzMH0.oD57Pm5qYafxeB5a9u_z6IW7V7fVypD5gmkUfsmikLg'
  }
};

export default () => {
  // 🔧 DEBUG: Verificar variáveis de ambiente
  console.log('🔧 === DATABASE CONFIG DEBUG ===');
  console.log(
    'POSTGRES_HOST:',
    process.env.POSTGRES_HOST ?? '❌UNDEFINED (usando default)',
  );
  console.log(
    'POSTGRES_PORT:',
    process.env.POSTGRES_PORT ?? '❌UNDEFINED (usando default)',
  );
  console.log(
    'POSTGRES_USER:',
    process.env.POSTGRES_USER ?? '❌UNDEFINED (usando default)',
  );
  console.log(
    'POSTGRES_PASSWORD:',
    process.env.POSTGRES_PASSWORD ? '✅ SET' : '❌UNDEFINED (usando default)',
  );
  console.log(
    'POSTGRES_DB:',
    process.env.POSTGRES_DB ?? '❌UNDEFINED (usando default)',
  );
  console.log('================================');

  return {
    postgres: {
      host: process.env.POSTGRES_HOST ?? 'localhost',
      port: parseInt(process.env.POSTGRES_PORT ?? '5432', 10),
      user: process.env.POSTGRES_USER ?? 'postgres',
      password: process.env.POSTGRES_PASSWORD ?? 'postgres',
      db: process.env.POSTGRES_DB ?? 'shelftalk',
    },
  };
};

export default () => ({
  postgres: {
    host: process.env.POSTGRES_HOST ?? 'localhost',
    port: parseInt(process.env.POSTGRES_PORT ?? '5432', 10),
    user: process.env.POSTGRES_USER ?? 'postgres',
    password: process.env.POSTGRES_PASSWORD ?? 'postgres',
    db: process.env.POSTGRES_DB ?? 'shelftalk',
  },
});

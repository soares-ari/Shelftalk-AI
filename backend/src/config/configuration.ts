export default () => ({
  postgres: {
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT ?? '5432', 10),
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    db: process.env.POSTGRES_DB,
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT ?? '6379', 10),
  },
});

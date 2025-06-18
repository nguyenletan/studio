import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Conditionally set datasource URL for production if RUNTIME_DATABASE_URL (e.g., Accelerate) is provided.
// DATABASE_URL will be used for local development and for `prisma migrate deploy` during Vercel build.
const dataSourceUrl = process.env.NODE_ENV === 'production' && process.env.RUNTIME_DATABASE_URL
  ? process.env.RUNTIME_DATABASE_URL
  : process.env.DATABASE_URL;

const prisma = global.prisma || new PrismaClient({
  datasources: {
    db: {
      url: dataSourceUrl,
    },
  },
});

if (process.env.NODE_ENV === 'development') {
  global.prisma = prisma;
}

export default prisma;

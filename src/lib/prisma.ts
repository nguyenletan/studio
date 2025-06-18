
import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Normalize RUNTIME_DATABASE_URL if it uses the older "prisma+postgres://" scheme
let runtimeDbUrl = process.env.RUNTIME_DATABASE_URL;
if (runtimeDbUrl && runtimeDbUrl.startsWith('prisma+postgres://')) {
  runtimeDbUrl = runtimeDbUrl.replace('prisma+postgres://', 'prisma://');
}

const dataSourceUrl = process.env.NODE_ENV === 'production' && runtimeDbUrl
  ? runtimeDbUrl // Use normalized Accelerate URL
  : process.env.DATABASE_URL; // Direct URL for dev or Vercel build migrations (DATABASE_URL)

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

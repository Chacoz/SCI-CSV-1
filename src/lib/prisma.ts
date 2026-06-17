import { PrismaClient } from "@prisma/client";

// Singleton du client Prisma — évite d'ouvrir trop de connexions en dev (hot reload)
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Préfère la connexion directe (non poolée) si disponible — plus fiable avec Prisma
// qu'une connexion poolée via PgBouncer, et suffisant au trafic d'un petit outil de gestion.
const datasourceUrl =
  process.env.DATABASE_URL_UNPOOLED ||
  process.env.POSTGRES_URL_NON_POOLING ||
  process.env.DATABASE_URL;

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasourceUrl,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

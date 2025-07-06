import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query'], // supprime si tu veux moins de logs
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

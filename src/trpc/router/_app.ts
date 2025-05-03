import { z } from 'zod'
import { createTRPCRouter } from '../init'
import { categoriesRouter } from '@/modules/categories/server/procedures'
import { authRouter } from '@/modules/auth/procedures'
export const appRouter = createTRPCRouter({
  auth: authRouter,
  categories: categoriesRouter,
})
// export type definition of API
export type AppRouter = typeof appRouter

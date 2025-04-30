import { Category } from '@/payload-types'
import { baseProcedure, createTRPCRouter } from '@/trpc/init'

export const categoriesRouter = createTRPCRouter({
  getMany: baseProcedure.query(async ({ ctx }) => {
    const data = await ctx.db.find({
      collection: 'categories',
      // We add depth 1 for populate subcategories
      depth: 1,
      pagination: false,
      sort: 'name',
      where: {
        parent: {
          exists: false,
        },
      },
    })
    const formattedData = data.docs.map((doc) => ({
      ...doc,
      subcategories: (doc.subcategories?.docs ?? []).map((doc) => ({
        // As we added depth 1. We know that doc will type category
        ...(doc as Category),
        subcategories: undefined,
      })),
    }))
    return formattedData
  }),
})

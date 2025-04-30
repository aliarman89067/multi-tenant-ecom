import { inferRouterOutputs, inferRouterInputs } from '@trpc/server'
import type { AppRouter } from '@/trpc/router/_app'

export type CategoriesGetMenyOutputs = inferRouterOutputs<AppRouter>['categories']['getMany']
export type CategoriesGetMenyOutputsSingle = CategoriesGetMenyOutputs[0]

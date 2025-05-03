import { headers as getHeaders, cookies as getCookies } from 'next/headers'
import { baseProcedure, createTRPCRouter } from '@/trpc/init'
import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { AUTH_COOKIE } from './constant'
import { registerSchema } from './schema'

export const authRouter = createTRPCRouter({
  session: baseProcedure.query(async ({ ctx }) => {
    const headers = await getHeaders()

    const session = await ctx.db.auth({ headers })

    return session
  }),
  register: baseProcedure.input(registerSchema).mutation(async ({ input, ctx }) => {
    const existingUser = await ctx.db.find({
      collection: 'users',
      limit: 1,
      where: {
        username: {
          equals: input.username,
        },
      },
    })
    const userFinded = existingUser.docs[0]
    if (userFinded) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'username already taken',
      })
    }
    await ctx.db.create({
      collection: 'users',
      data: {
        email: input.email,
        username: input.username,
        password: input.password, // This will be hashed by payload
      },
    })

    const data = await ctx.db.login({
      collection: 'users',
      data: {
        email: input.email,
        password: input.password,
      },
    })
    if (!data.token) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Failed to login',
      })
    }

    const cookies = await getCookies()

    cookies.set({
      name: AUTH_COOKIE,
      value: data.token,
      httpOnly: true,
      path: '/',
      // domain:""
      // TODO: Ensure cross domain cookie sharing
      //Because we have multi tenant functionality so user login to funroad.com then navgigate to their tenant route ali.funroad.com so they don't have cookie any more so they logout we need to fix this problem.
    })
    return data
  }),
  login: baseProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const data = await ctx.db.login({
        collection: 'users',
        data: {
          email: input.email,
          password: input.password,
        },
      })
      if (!data.token) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Failed to login',
        })
      }
      const cookies = await getCookies()
      cookies.set({
        name: AUTH_COOKIE,
        value: data.token,
        httpOnly: true,
        path: '/',
        sameSite: 'none',
        // domain:""
        // TODO: Ensure cross domain cookie sharing
        //Because we have multi tenant functionality so user login to funroad.com then navgigate to their tenant route ali.funroad.com so they don't have cookie any more so they logout we need to fix this problem.
      })
      return data
    }),
  logout: baseProcedure.mutation(async () => {
    const cookies = await getCookies()
    cookies.delete(AUTH_COOKIE)
  }),
})

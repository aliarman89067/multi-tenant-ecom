import { z } from 'zod'

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(3, 'Password must be atleast 3 characters'),
  username: z
    .string()
    .min(3, { message: 'Username must be atleast 3 characters' })
    .max(63, { message: 'User name must be less than 63 characters' })
    .regex(
      /^[a-z0-9][a-z0-9-]*[a-z0-9]$/,
      'Username can only contain lowercase letters, numbers and hyphens. It must start and end with letter or number',
    )
    .refine((val) => !val.includes('--'), 'Username cannot contain consecutive hyphens')
    .transform((val) => val.toLowerCase()),
})

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

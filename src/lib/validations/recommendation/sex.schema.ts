import { z } from 'zod'

export const SexSchema = z.enum(['masculino', 'femenino'])


export type Sex = z.infer<typeof SexSchema>

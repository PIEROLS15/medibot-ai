import { z } from 'zod'

export const SeveritySchema = z.enum(['leve', 'moderada', 'severa'])

export type Severity = z.infer<typeof SeveritySchema>

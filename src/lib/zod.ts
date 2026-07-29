import { z } from 'zod'

export function formatZodErrors(error: z.ZodError) {
    const formatted: Record<string, string> = {}

    error.errors.forEach((item) => {
        formatted[item.path[0] as string] = item.message
    })

    return formatted
}

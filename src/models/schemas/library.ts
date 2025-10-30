import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

export const UpdateGameProgressSchema = z.object({
    gameId: z.string().uuid().openapi({description: "The unique identifier of the user's game"}),
    progress: z.number().min(0).max(100).optional().openapi({description: "The user's progress in the game, represented as a percentage"})
})

export type GameProgress = z.infer<typeof UpdateGameProgressSchema>;
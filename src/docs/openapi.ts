import { OpenAPIRegistry, OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import { UpdateGameProgressSchema } from '../models/schemas/library.js';

const registry = new OpenAPIRegistry();

const paramsSchema = z.object({
    gameId: z.string().openapi({ description: "The game id in the path" }),
});

const requestBodySchema = UpdateGameProgressSchema.omit({ gameId: true });

registry.registerPath({
    method: 'patch',
    path: '/library/{gameId}/progress',
    description: 'Update game progress in user library',
    summary: 'Update game progress',
        request: {
            params: paramsSchema,
            body: { content: { 'application/json': { schema: requestBodySchema } } },
        },
        responses: {
            200: { description: 'OK', content: { 'application/json': { schema: z.object({message: z.string(), gameId: z.string(), progress: z.number().optional(),}) } } },
            401: { description: 'Unauthorized', content: { 'application/json': { schema: z.object({ message: z.string().default('Unauthorized') }) } } },
            500: { description: 'Internal Server Error', content: { 'application/json': { schema: z.object({ message: z.string().default('Internal server error') }) } } },
        },
});


const generator = new OpenApiGeneratorV3(registry.definitions);
const doc = generator.generateDocument({
    openapi: '3.0.0',
    info: { title: 'Platinum Hunters API', version: '1.0.0' },
});

export default doc;
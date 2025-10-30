import { Router,type Request, type Response } from "express";
import { UpdateGameProgressSchema } from "../models/schemas/library.js";
const route = Router();

//GET: Get games list by user ID


//POST: Add a new game to user's library


//POST: Remove a game from user's library


//PATCH: Update game progress in user's library
route.patch(
    "/library/:gameId/progress",
    async (req: Request<{ gameId: string }, unknown, { progress?: number }>, res: Response) => {
        const payload = { gameId: req.params.gameId, progress: req.body?.progress };
        const result = UpdateGameProgressSchema.safeParse(payload);
        if (!result.success) {
            return res.status(400).json({ errors: result.error.format() });
        }

        try {
            // Substituir dps pela chamada ao DB!
            await new Promise((resolve) => setTimeout(resolve, 100));

            const { gameId, progress } = result.data;
            return res.status(200).json({
                message: "Game progress updated successfully",
                gameId,
                ...(progress !== undefined ? { progress } : {}),
            });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
);
export default route;
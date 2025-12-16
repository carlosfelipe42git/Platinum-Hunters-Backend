import { Router, Request, Response } from 'express';
import { requireAuth } from '../middlewares/passportAuth.js'; 
import { UserModel } from '../data/documents/userDocument.js';
import ChallengeModel from '../models/ChallengeModel.js';
import TitleModel from '../models/TitleModel.js'; 

const route = Router();

route.get('/shop/titles', async (req: Request, res: Response) => {
    try {
        const titles = await TitleModel.find().sort({ cost: 1 });
        res.json(titles);
    } catch (error) {
        res.status(500).json({ message: "Erro ao buscar títulos." });
    }
});

route.post('/shop/manage/title', requireAuth, async (req: Request, res: Response) => {
    try {
        const { id, name, cost } = req.body; 
        if (id) {
            const title = await TitleModel.findById(id);
            if (!title) return res.status(404).json({ message: "Título não encontrado." });
            title.name = name;
            title.cost = cost;
            await title.save();
            return res.json({ message: "Título atualizado!", title });
        } else {
            const newTitle = await TitleModel.create({ name, cost });
            return res.status(201).json({ message: "Título criado!", title: newTitle });
        }
    } catch (error: any) {
        if (error.code === 11000) return res.status(400).json({ message: "Já existe um título com este nome." });
        res.status(500).json({ message: "Erro ao salvar título." });
    }
});

route.delete('/shop/manage/title/:id', requireAuth, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await TitleModel.findByIdAndDelete(id);
        return res.json({ message: "Título excluído!", id });
    } catch (error) {
        res.status(500).json({ message: "Erro ao excluir título." });
    }
});

route.get('/challenges', async (req: Request, res: Response) => {
    try {
        const challenges = await ChallengeModel.find().sort({ day: 1 });
        res.json(challenges);
    } catch (error) {
        res.status(500).json({ message: "Erro ao buscar desafios." });
    }
});

route.post('/ranking/manage/challenge', requireAuth, async (req: Request, res: Response) => {
    try {
        const { day, title, points } = req.body;
        let challenge = await ChallengeModel.findOne({ day });
        if (challenge) {
            challenge.title = title;
            challenge.points = points;
            await challenge.save();
            return res.json({ message: "Desafio atualizado!", challenge });
        } else {
            challenge = await ChallengeModel.create({ day, title, points });
            return res.status(201).json({ message: "Desafio criado!", challenge });
        }
    } catch (error: any) {
        res.status(500).json({ message: "Erro ao salvar desafio." });
    }
});

route.delete('/ranking/manage/challenge/:day', requireAuth, async (req: Request, res: Response) => {
    try {
        const day = parseInt(req.params.day);
        await ChallengeModel.deleteOne({ day });
        await UserModel.updateMany({ completedChallenges: day }, { $pull: { completedChallenges: day } });
        return res.json({ message: "Desafio excluído e histórico limpo!", day });
    } catch (error) {
        res.status(500).json({ message: "Erro ao excluir desafio." });
    }
});

route.get('/ranking', async (req: Request, res: Response) => {
    try {
        const users = await UserModel.find()
            .sort({ rankingPoints: -1 })
            .limit(50)
            .select('username rankingPoints coins equippedTitle profileImageUrl platinums totalTrophies completedChallenges');
        
        const formattedUsers = users.map(u => ({
            id: u._id,
            name: u.username,
            avatar: u.profileImageUrl || "https://i.pravatar.cc/100?img=3",
            rankingPoints: u.rankingPoints || 0,
            equippedTitle: u.equippedTitle,
            platinums: 0,
            totalTrophies: 0,
            completedChallenges: u.completedChallenges || [] 
        }));
        res.json(formattedUsers);
    } catch (error) {
        res.status(500).json({ message: "Erro ao buscar ranking" });
    }
});

route.post('/ranking/complete', requireAuth, async (req: Request, res: Response) => {
    try {
        const { day, points } = req.body;
        const userId = (req.user as any)._id || (req.user as any).id;
        const user = await UserModel.findById(userId);
        if (!user) return res.status(404).json({ message: "Usuário não encontrado" });
        if (!user.completedChallenges) user.completedChallenges = [];
        if (user.completedChallenges.includes(day)) return res.status(400).json({ message: "Desafio já completado." });
        user.rankingPoints = (user.rankingPoints || 0) + points;
        user.coins = (user.coins || 0) + points;
        user.completedChallenges.push(day);
        await user.save();
        res.json({ message: "Desafio completado!", newPoints: user.rankingPoints, newCoins: user.coins, completedChallenges: user.completedChallenges });
    } catch (error) {
        res.status(500).json({ message: "Erro ao completar desafio" });
    }
});

route.post('/shop/buy', requireAuth, async (req: Request, res: Response) => {
    try {
        const { title, cost } = req.body;
        const userId = (req.user as any)._id;
        const user = await UserModel.findById(userId);
        if (!user) return res.status(404).json({ message: "Usuário não encontrado" });
        if (user.coins < cost) return res.status(400).json({ message: "Moedas insuficientes" });
        if (user.ownedTitles && user.ownedTitles.includes(title)) return res.status(400).json({ message: "Você já possui este título" });
        user.coins -= cost;
        if (!user.ownedTitles) user.ownedTitles = [];
        user.ownedTitles.push(title);
        await user.save();
        res.json({ message: "Título comprado!", coins: user.coins, ownedTitles: user.ownedTitles });
    } catch (error) { res.status(500).json({ message: "Erro ao comprar título" }); }
});

route.post('/shop/equip', requireAuth, async (req: Request, res: Response) => {
    try {
        const { title } = req.body;
        const userId = (req.user as any)._id;
        const user = await UserModel.findById(userId);
        if (!user) return res.status(404).json({ message: "Usuário não encontrado" });
        if (!user.ownedTitles || !user.ownedTitles.includes(title)) return res.status(400).json({ message: "Você não possui este título" });
        user.equippedTitle = title;
        await user.save();
        res.json({ message: "Título equipado!", equippedTitle: user.equippedTitle });
    } catch (error) { res.status(500).json({ message: "Erro ao equipar título" }); }
});

export default route;
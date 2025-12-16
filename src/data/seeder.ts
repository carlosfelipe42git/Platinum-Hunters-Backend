import ChallengeModel from '../models/ChallengeModel.js';
import TitleModel from '../models/TitleModel.js';
import { UserModel } from './documents/userDocument.js'; 

const INITIAL_TITLES = [
    { name: "🌸 Explorador de Sakura 🌸", cost: 100 },
    { name: "⚔️ Caçador de Elite ⚔️", cost: 200 },
    { name: "🧩 Complecionista de Puzzles 🧩", cost: 150 },
    { name: "📝 Mestre das Reviews 📝", cost: 250 },
    { name: "✨ Colecionador de Estrelas ✨", cost: 300 },
    { name: "🛡️ Defensor Lendário 🛡️", cost: 450 },
    { name: "🌌 Viajante Interdimensional 🌌", cost: 500 },
    { name: "👑 Soberano do Reino 👑", cost: 1000 },
    { name: "🔮 Oráculo Misterioso 🔮", cost: 750 },
    { name: "🚀 Piloto Estelar 🚀", cost: 600 },
    { name: "💖 Coração de Ouro 💖", cost: 200 },
    { name: "⚙️ Engenheiro Mestre ⚙️", cost: 350 },
    { name: "🖋️ Cronista da História 🖋️", cost: 250 },
    { name: "💎 Tesouro Perdido 💎", cost: 850 },
    { name: "🌙 Sentinela Noturno 🌙", cost: 400 },
];

const INITIAL_CHALLENGES = [
    { day: 1, title: "Jogue 30 minutos em qualquer jogo", points: 50 },
    { day: 2, title: "Termine 1 review de um jogo", points: 75 },
    { day: 3, title: "Conseguir 1 troféu num jogo indie", points: 100 },
    { day: 4, title: "Completar 1 nível num jogo de plataforma", points: 50 },
    { day: 5, title: "Colete 100 pontos num jogo", points: 60 },
    { day: 6, title: "Ganhe uma partida num jogo competitivo", points: 80 },
    { day: 7, title: "Desbloqueie um troféu escondido", points: 150 },
    { day: 8, title: "Jogue 30 minutos em qualquer jogo", points: 50 },
    { day: 9, title: "Termine 1 review de um jogo", points: 75 },
    { day: 10, title: "Conseguir 1 troféu num jogo indie", points: 100 },
    { day: 11, title: "Completar 1 nível num jogo de plataforma", points: 50 },
    { day: 12, title: "Colete 100 pontos num jogo", points: 60 },
    { day: 13, title: "Ganhe uma partida num jogo competitivo", points: 80 },
    { day: 14, title: "Desbloqueie um troféu escondido", points: 150 },
    { day: 15, title: "Jogue 30 minutos em qualquer jogo", points: 50 },
    { day: 16, title: "Termine 1 review de um jogo", points: 75 },
    { day: 17, title: "Conseguir 1 troféu num jogo indie", points: 100 },
    { day: 18, title: "Completar 1 nível num jogo de plataforma", points: 50 },
    { day: 19, title: "Colete 100 pontos num jogo", points: 60 },
    { day: 20, title: "Ganhe uma partida num jogo competitivo", points: 80 },
    { day: 21, title: "Desbloqueie um troféu escondido", points: 150 },
    { day: 22, title: "Jogue 30 minutos em qualquer jogo", points: 50 },
    { day: 23, title: "Termine 1 review de um jogo", points: 75 },
    { day: 24, title: "Conseguir 1 troféu num jogo indie", points: 100 },
    { day: 25, title: "Completar 1 nível num jogo de plataforma", points: 50 },
    { day: 26, title: "Colete 100 pontos num jogo", points: 60 },
    { day: 27, title: "Ganhe uma partida num jogo competitivo", points: 80 },
    { day: 28, title: "Desbloqueie um troféu escondido", points: 150 },
    { day: 29, title: "Jogue 30 minutos em qualquer jogo", points: 50 },
    { day: 30, title: "Termine 1 review de um jogo", points: 75 },
];

const INITIAL_USERS = [
    {
        _id: "seed-user-01", 
        username: "kaori",
        email: "kaori@fake.com",
        passwordHash: "placeholder_pass",
        profileImageUrl: "https://i.pravatar.cc/150?img=5",
        roles: ["USER"],
        rankingPoints: 15300, 
        coins: 1200,
        completedChallenges: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
        ownedTitles: ["👑 Soberano do Reino 👑", "🌸 Explorador de Sakura 🌸"],
        equippedTitle: "🌸 Explorador de Sakura 🌸"
    },
    {
        _id: "seed-user-02",
        username: "nineko",
        email: "nineko@fake.com",
        passwordHash: "placeholder_pass",
        profileImageUrl: "https://i.pravatar.cc/150?img=11",
        roles: ["USER"],
        rankingPoints: 12000, 
        coins: 500,
        completedChallenges: [1, 2, 3, 4, 5, 10, 11, 12],
        ownedTitles: ["⚔️ Caçador de Elite ⚔️"],
        equippedTitle: "⚔️ Caçador de Elite ⚔️"
    },
    {
        _id: "seed-user-03",
        username: "player_three",
        email: "p3@fake.com",
        passwordHash: "placeholder_pass",
        profileImageUrl: "https://i.pravatar.cc/150?img=14",
        roles: ["USER"],
        rankingPoints: 9800, 
        coins: 100,
        completedChallenges: [1, 2, 3],
        ownedTitles: [],
        equippedTitle: null
    },
    {
        _id: "seed-user-04",
        username: "gamer_legend",
        email: "legend@fake.com",
        passwordHash: "placeholder_pass",
        profileImageUrl: "https://i.pravatar.cc/150?img=13",
        roles: ["USER"],
        rankingPoints: 4300, 
        coins: 50,
        completedChallenges: [1],
        ownedTitles: ["🚀 Piloto Estelar 🚀"],
        equippedTitle: "🚀 Piloto Estelar 🚀"
    }
];

export const seedDatabase = async () => {
    try {
        console.log("🔄 Iniciando Seed (Modo Persistente)...");

        let newTitlesCount = 0;
        for (const title of INITIAL_TITLES) {
            const exists = await TitleModel.findOne({ name: title.name });
            if (!exists) {
                await TitleModel.create(title);
                newTitlesCount++;
            }
        }
        console.log(`✅ Títulos verificados! (${newTitlesCount} novos criados)`);

        let newChallengesCount = 0;
        for (const challenge of INITIAL_CHALLENGES) {
            const exists = await ChallengeModel.findOne({ day: challenge.day });
            if (!exists) {
                await ChallengeModel.create(challenge);
                newChallengesCount++;
            }
        }
        console.log(`✅ Desafios verificados! (${newChallengesCount} novos criados)`);
        console.log("👤 Atualizando usuários placeholder...");
        for (const user of INITIAL_USERS) {

            await UserModel.findByIdAndUpdate(user._id, user, { upsert: true, new: true });
        }
        console.log("✅ Usuários placeholder sincronizados!");

    } catch (error) {
        console.error("❌ Erro ao semear o banco:", error);
    }
};
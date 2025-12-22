import mongoose from 'mongoose';
import ChallengeModel from '../models/ChallengeModel.js';
import dotenv from 'dotenv';

dotenv.config();

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

export const seedChallenges = async () => {
    try {
        console.log('🌱 Starting challenges seed...');

        let newChallengesCount = 0;
        let skippedChallengesCount = 0;

        for (const challenge of INITIAL_CHALLENGES) {
            const exists = await ChallengeModel.findOne({ day: challenge.day });
            if (!exists) {
                await ChallengeModel.create(challenge);
                newChallengesCount++;
            } else {
                skippedChallengesCount++;
            }
        }

        console.log(`✅ Challenges created: ${newChallengesCount}`);
        console.log(`⏭️  Challenges skipped (already exist): ${skippedChallengesCount}`);

        return newChallengesCount;
    } catch (error: any) {
        console.error('❌ Error seeding challenges:', error.message);
        throw error;
    }
};

const runSeed = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI_LOCAL || process.env.MONGODB_URI;

        if (!mongoUri) {
            console.error('❌ MONGODB_URI_LOCAL ou MONGODB_URI not found in environment variables');
            process.exit(1);
        }

        const isLocal = mongoUri === process.env.MONGODB_URI_LOCAL;
        console.log(`🔌 Connecting to MongoDB ${isLocal ? 'LOCAL' : 'ATLAS'}...`);
        await mongoose.connect(mongoUri);
        console.log(`✅ Connected to MongoDB ${isLocal ? 'LOCAL' : 'ATLAS'}!`);

        await seedChallenges();

        console.log('🎉 Seed completed successfully!');
    } catch (error) {
        console.error('💥 Seed failed:', error);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
        console.log('👋 Disconnected from MongoDB');
    }
};

runSeed();

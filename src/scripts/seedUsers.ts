import mongoose from 'mongoose';
import { createUserService } from '../services/user/createUserService.js';
import { UserRankingDataModel } from '../data/documents/userRankingDataDocument.js';
import { CompletedChallengeModel } from '../data/documents/completedChallengeDocument.js';
import dotenv from 'dotenv';

dotenv.config();

const PLACEHOLDER_USERS = [
    {
        username: "kaori",
        email: "kaori@fake.com",
        password: "TestPass123",
        profileImageUrl: "https://i.pravatar.cc/150?img=5",
        rankingData: {
            rankingPoints: 15300,
            coins: 1200,
            ownedTitles: ["👑 Soberano do Reino 👑", "🌸 Explorador de Sakura 🌸"],
            equippedTitle: "🌸 Explorador de Sakura 🌸"
        },
        completedChallenges: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
    },
    {
        username: "nineko",
        email: "nineko@fake.com",
        password: "TestPass123",
        profileImageUrl: "https://i.pravatar.cc/150?img=11",
        rankingData: {
            rankingPoints: 12000,
            coins: 500,
            ownedTitles: ["⚔️ Caçador de Elite ⚔️"],
            equippedTitle: "⚔️ Caçador de Elite ⚔️"
        },
        completedChallenges: [1, 2, 3, 4, 5, 10, 11, 12]
    },
    {
        username: "player_three",
        email: "p3@fake.com",
        password: "TestPass123",
        profileImageUrl: "https://i.pravatar.cc/150?img=14",
        rankingData: {
            rankingPoints: 9800,
            coins: 100,
            ownedTitles: [],
            equippedTitle: null
        },
        completedChallenges: [1, 2, 3]
    },
    {
        username: "gamer_legend",
        email: "legend@fake.com",
        password: "TestPass123",
        profileImageUrl: "https://i.pravatar.cc/150?img=13",
        rankingData: {
            rankingPoints: 4300,
            coins: 50,
            ownedTitles: ["🚀 Piloto Estelar 🚀"],
            equippedTitle: "🚀 Piloto Estelar 🚀"
        },
        completedChallenges: [1]
    }
];

export const seedUsers = async () => {
  try {
    console.log('🌱 Starting placeholder users seed...');
    console.log('🔑 Default password for all test users: "TestPass123"');

    console.log(`📦 Found ${PLACEHOLDER_USERS.length} placeholder users to seed`);

    let usersCreated = 0;
    let usersSkipped = 0;

    for (const userData of PLACEHOLDER_USERS) {
      // Verificar se o usuário já existe
      const { findUserByEmail } = await import('../services/user/createUserService.js');
      const existing = await findUserByEmail(userData.email);
      
      if (existing) {
        console.log(`   ⏭️  Skipping ${userData.username} (already exists)`);
        usersSkipped++;
        continue;
      }

      // Criar usuário usando createUserService
      const newUser = await createUserService({
        username: userData.username,
        email: userData.email,
        password: userData.password,
        profileImageUrl: userData.profileImageUrl
      });

      // Criar dados de ranking
      await UserRankingDataModel.create({
        userId: newUser.id,
        ...userData.rankingData
      });

      // Criar registros de desafios completados
      for (const challengeDay of userData.completedChallenges) {
        await CompletedChallengeModel.create({
          userId: newUser.id,
          challengeDay,
          pointsEarned: 50 // Valor padrão, pode ser ajustado
        });
      }

      console.log(`   ✅ Created ${userData.username}`);
      usersCreated++;
    }

    console.log(`\n✅ Users created: ${usersCreated}`);
    console.log(`⏭️  Users skipped: ${usersSkipped}`);

    return usersCreated;
  } catch (error: any) {
    console.error('❌ Error seeding users:', error.message);
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

    await seedUsers();

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

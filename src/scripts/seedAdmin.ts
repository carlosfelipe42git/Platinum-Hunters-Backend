import mongoose from 'mongoose';
import { UserModel } from '../data/documents/userDocument.js';
import { UserRankingDataModel } from '../data/documents/userRankingDataDocument.js';
import { hashPassword } from '../services/passwordHasher.js';
import { generateUUID } from '../utils/uuid.js';
import dotenv from 'dotenv';

dotenv.config();

const ADMIN_USER = {
    username: "admin",
    email: "Admin123@gmail.com",
    password: "admin123",
    profileImageUrl: "https://i.pravatar.cc/150?img=1",
    roles: ["ADMIN", "USER"]
};

export const seedAdmin = async () => {
    try {
        console.log('🌱 Starting admin user seed...');
        console.log(`📧 Admin email: ${ADMIN_USER.email}`);
        console.log(`🔑 Admin password: ${ADMIN_USER.password}`);

        // Verificar se o admin já existe
        const existingAdmin = await UserModel.findOne({ 
            email: ADMIN_USER.email.toLowerCase() 
        });

        if (existingAdmin) {
            console.log('   ⏭️  Admin user already exists, skipping...');
            return 0;
        }

        // Verificar se o username já existe
        const existingUsername = await UserModel.findOne({ 
            username: ADMIN_USER.username 
        });

        if (existingUsername) {
            console.log('   ⚠️  Username "admin" already exists, skipping...');
            return 0;
        }

        // Criar hash da senha
        const passwordHash = await hashPassword(ADMIN_USER.password);

        // Criar documento do admin
        const adminUser = new UserModel({
            _id: generateUUID(),
            username: ADMIN_USER.username,
            email: ADMIN_USER.email.toLowerCase(),
            passwordHash,
            profileImageUrl: ADMIN_USER.profileImageUrl,
            roles: ADMIN_USER.roles,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        await adminUser.save();

        // Criar dados de ranking para o admin
        await UserRankingDataModel.create({
            userId: adminUser.id,
            rankingPoints: 0,
            coins: 0,
            ownedTitles: [],
            equippedTitle: null
        });

        console.log('   ✅ Admin user created successfully');
        console.log(`   📋 User ID: ${adminUser.id}`);
        console.log(`   👤 Username: ${adminUser.username}`);
        console.log(`   📧 Email: ${adminUser.email}`);
        console.log(`   🔐 Roles: ${adminUser.roles.join(', ')}`);

        return 1;
    } catch (error: any) {
        console.error('❌ Error seeding admin user:', error.message);
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

        await seedAdmin();

        console.log('🎉 Admin seed completed successfully!');
    } catch (error) {
        console.error('💥 Seed failed:', error);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
        console.log('👋 Disconnected from MongoDB');
    }
};

runSeed();

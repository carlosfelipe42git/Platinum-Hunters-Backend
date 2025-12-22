import mongoose, { ConnectOptions } from 'mongoose';

// Prioriza URI local, se não existir usa a do Atlas
const MONGO_URI = process.env.MONGODB_URI_LOCAL || process.env.MONGODB_URI;

export const connectDB = async () => {
  if (!MONGO_URI) {
    console.error('MONGODB_URI_LOCAL ou MONGODB_URI não estão definidos no arquivo .env');
    process.exit(1); 
  }
  
  try {
    const isLocal = MONGO_URI === process.env.MONGODB_URI_LOCAL;
    console.log(`🔌 Conectando ao MongoDB ${isLocal ? 'LOCAL' : 'ATLAS'}...`);
    
    await mongoose.connect(MONGO_URI);
    console.log(`✅ MongoDB conectado com sucesso! (${isLocal ? 'LOCAL' : 'ATLAS'})`);

    mongoose.connection.on('error', (err) => {
      console.error(`Erro do Mongoose: ${err.message}`);
    });

  } catch (error) {
    console.error('Falha ao conectar ao MongoDB:', error);
    process.exit(1); 
  }
};
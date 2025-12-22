import mongoose, { Schema, Document } from 'mongoose';

export interface IUserModel extends Document {
  _id: string; // <--- Adicione a tipagem aqui para o TypeScript saber
  username: string;
  email: string;
  passwordHash: string;
  roles: string[];
  coins: number;
  rankingPoints: number;
  ownedTitles: string[];
  equippedTitle: string | null;
  profileImageUrl?: string;
  completedChallenges: number[];
}

const UserSchema: Schema = new Schema({
  _id: { type: String }, // <--- ESSA É A LINHA MÁGICA. Ela diz pro Mongo aceitar o UUID.
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  roles: { type: [String], default: ['USER'] },
  coins: { type: Number, default: 0 },
  rankingPoints: { type: Number, default: 0 },
  ownedTitles: { type: [String], default: [] },
  equippedTitle: { type: String, default: null },
  profileImageUrl: { type: String },
  completedChallenges: { type: [Number], default: [] }
}, {
  timestamps: true,
  _id: false // Importante: Desabilita a geração automática do _id pelo Mongo, já que vocês geram UUID
});

export default mongoose.model<IUserModel>('user', UserSchema);
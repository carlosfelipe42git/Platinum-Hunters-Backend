import { UserModel } from "../../data/documents/userDocument.js";
import { generateToken } from "../../auth/token.js";
import { BadRequestException } from "../../exceptions/httpException.js";
import { comparePassword } from "../passwordHasher.js";

interface LoginUserDto {
  email: string;
  password: string;
}

export const loginUserService = async (credentials: LoginUserDto) => {
  const { email, password } = credentials;
  const userDocument = await UserModel.findOne({ email: email.toLowerCase() });

  if (!userDocument) {
    throw new BadRequestException("Invalid email or password");
  }

  const passwordIsValid = await comparePassword(password, userDocument.passwordHash);

  if (!passwordIsValid) {
    throw new BadRequestException("Invalid email or password");
  }

  const token = generateToken({
    userId: userDocument._id.toString(), 
    email: userDocument.email,
    username: userDocument.username,
    roles: userDocument.roles as any
  });

  return {
    id: userDocument._id.toString(),
    username: userDocument.username,
    email: userDocument.email,
    profileImageUrl: userDocument.profileImageUrl,
    coins: userDocument.coins || 0,
    rankingPoints: userDocument.rankingPoints || 0,
    completedChallenges: userDocument.completedChallenges || [],
    ownedTitles: userDocument.ownedTitles || [],
    equippedTitle: userDocument.equippedTitle || null,
    token,
  };
};
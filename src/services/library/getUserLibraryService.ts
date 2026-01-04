import { LibraryItemModel } from "../../data/documents/libraryItemDocument.js";
import { GameModel } from "../../data/documents/gameDocument.js";
import { LibraryItemStatus } from "../../models/libraryItemStatus.js";

type GetLibraryInput = {
  userId: string;
  status?: LibraryItemStatus;
  name?: string;
  page?: number;
  limit?: number;
}

export const getUserLibraryService = async (input: GetLibraryInput) => {
  const { userId, status, name, page = 1, limit = 20 } = input;

  const filter: any = { userId };
  if (status) {
    filter.status = status;
  }

  const skip = (page - 1) * limit;

  const libraryItems = await LibraryItemModel
    .find(filter)
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const gameIds = libraryItems.map(item => item.gameId);
  const games = await GameModel.find({ _id: { $in: gameIds } }).lean();
  
  const gamesMap = new Map(games.map(game => [game._id, game]));

  // Normaliza o filtro de nome para lowercase
  const normalizedName = name ? name.toLowerCase().trim() : null;

  const items = libraryItems
    .filter(item => {
      if (!normalizedName) return true;
      const game = gamesMap.get(item.gameId);
      return game && game.nome.toLowerCase().includes(normalizedName);
    })
    .map(item => {
      const game = gamesMap.get(item.gameId);
      return {
        ...item,
        status: item.status,
        gameDetails: game ? {
          nome: game.nome,
          plataformas: game.plataformas,
          genres: game.genres,
          rating: game.rating,
          playtime: game.playtime,
          ratings_count: game.ratings_count,
          backgroundimage: game.backgroundimage,
          ano_de_lancamento: game.ano_de_lancamento
        } : null
      };
    });

  // Conta total considerando o filtro de nome
  let total: number;
  if (name) {
    total = items.length;
  } else {
    total = await LibraryItemModel.countDocuments(filter);
  }

  return {
    items,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
}

import { CustomGameModel } from "../../data/documents/customGameDocument.js";
import { LibraryItemModel } from "../../data/documents/libraryItemDocument.js";
import { LibraryItemStatus } from "../../models/libraryItemStatus.js";

type GetCustomGamesInput = {
  userId: string;
  status?: LibraryItemStatus;
  name?: string;
  page?: number;
  limit?: number;
};

export const getCustomGamesService = async (input: GetCustomGamesInput) => {
  const { userId, status, name, page = 1 } = input;
  const limit = Math.min(input.limit || 20, 50);

  const skip = (page - 1) * limit;

  // Buscar todos os custom games do usuário
  const customGames = await CustomGameModel
    .find({ userId })
    .sort({ createdAt: -1 })
    .lean();

  // Buscar status dos jogos na biblioteca
  const gameIds = customGames.map(game => game._id);
  const libraryItems = await LibraryItemModel
    .find({ 
      userId,
      gameId: { $in: gameIds }
    })
    .lean();

  const statusMap = new Map(
    libraryItems.map(item => [item.gameId, item.status])
  );

  // Normaliza o filtro de nome para lowercase
  const normalizedName = name ? name.toLowerCase().trim() : null;

  let items = customGames
    .filter(game => {
      // Filtro de nome
      if (normalizedName && !game.nome.toLowerCase().includes(normalizedName)) {
        return false;
      }
      return true;
    })
    .map(game => ({
      ...game,
      status: statusMap.get(game._id) || null
    }));

  // Aplicar filtro de status
  if (status) {
    items = items.filter(item => item.status === status);
  }

  // Calcular total antes da paginação
  const total = items.length;

  items = items.slice(skip, skip + limit);

  return {
    items,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit)
  };
};

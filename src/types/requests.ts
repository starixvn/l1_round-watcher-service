import GameConfig from "./game-config";

type LobbyRequestBody = {
  games: Array<GameConfig>;
};

type PatternRequest = {
  gameId: number;
  pattern: string;
};

export { LobbyRequestBody, PatternRequest };

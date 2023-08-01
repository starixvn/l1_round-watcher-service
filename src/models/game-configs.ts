import mongoose from "mongoose";

interface GameConfig {
  name: string;
  gameId: number;
}

const Schema = new mongoose.Schema<GameConfig>({
  name: { type: String, required: true },
  gameId: { type: Number },
});

export default mongoose.model<GameConfig>("game_configs", Schema);

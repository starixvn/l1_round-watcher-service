import mongoose from "mongoose";
import { RoundCollectionMapper } from "../constants";

interface GameRound {
  id: string;
  result: string;
  settlementResult: string;
  time: string;
}

const Schema = new mongoose.Schema<GameRound>({
  id: { type: Number, required: true },
  result: { type: Object },
  settlementResult: { type: Object },
  time: { type: String },
});

export default (gameConfigName: string) =>
  mongoose.model<GameRound>(RoundCollectionMapper(gameConfigName), Schema);

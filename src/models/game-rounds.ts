import { Document } from "mongodb";
import mongoose from "mongoose";
import { RoundCollectionMapper } from "../constants";

export interface GameRound extends Document {
  id: number;
  result: Object;
  settlementResult: Object;
  time: Date;
}

const Schema = new mongoose.Schema<GameRound>({
  id: { type: Number, required: true },
  result: { type: Object },
  settlementResult: { type: Object },
  time: { type: Date },
});

export default (gameConfigName: string) => mongoose.model<GameRound>(RoundCollectionMapper(gameConfigName), Schema);

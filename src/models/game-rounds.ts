import mongoose from "mongoose";
import { RoundCollectionMapper } from "../constants";

const Schema = new mongoose.Schema({
  id: { type: Number, required: true },
  result: { type: Object },
  settlementResult: { type: Object },
  time: { type: String },
});

export default (gameConfigName: string) =>
  mongoose.model(RoundCollectionMapper(gameConfigName), Schema);

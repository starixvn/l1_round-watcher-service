import mongoose from "mongoose";

const GameSchema = new mongoose.Schema({
  id: Number,
  name: String,
});

const RoundTimerSchema = new mongoose.Schema({
  games: { type: [GameSchema] },
});

const Schema = new mongoose.Schema({
  roundTimerGame: { type: RoundTimerSchema },
});

export default mongoose.model("lobbies", Schema);

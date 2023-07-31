import mongoose from "mongoose";

const Schema = new mongoose.Schema({
  name: { type: String, required: true },
  gameId: { type: Number },
});

export default mongoose.model("game_configs", Schema);

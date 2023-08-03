import mongoose from "mongoose";

const RoundTimerSchema = new mongoose.Schema({
  gameIds: { type: [Number] },
});

const Schema = new mongoose.Schema({
  roundTimerGame: { type: RoundTimerSchema },
});

export default mongoose.model("lobbies", Schema);

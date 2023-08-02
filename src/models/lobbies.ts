import mongoose from "mongoose";

const Schema = new mongoose.Schema({
  roundTimerGame: { type: Object },
});

export default mongoose.model("lobbies", Schema);

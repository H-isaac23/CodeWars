import { Schema } from "mongoose";

export const matchSchema: Schema = new Schema({
  player1: {
    type: String,
    required: true,
  },
  player2: {
    type: String,
    required: true,
  },
  win: {
    type: String,
    required: true,
  },
});

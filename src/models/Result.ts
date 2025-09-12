// models/Result.ts
import mongoose, { Schema, Document, model } from "mongoose";

export interface IResult extends Document {
  athleteId: mongoose.Types.ObjectId | string;
  exercise: string;
  score: number;
  feedback: string[];
  corrections: string[];
  reps?: number;
  jumpHeightCm?: number;
  jumpDisplacementNorm?: number;
  turns?: number;
  splitTimes?: number[];
  cadence?: number;
  trunkAngleAvg?: number;
  trunkAngleMin?: number;
  trunkAngleMax?: number;
  distanceKm?: number;
  durationSec?: number;
  paceMinPerKm?: number;
  videoUrl?: string;
  createdAt: Date;
}

const ResultSchema = new Schema<IResult>({
  athleteId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  exercise: { type: String, required: true },
  score: { type: Number, required: true },
  feedback: { type: [String], default: [] },
  corrections: { type: [String], default: [] },
  reps: Number,
  jumpHeightCm: Number,
  jumpDisplacementNorm: Number,
  turns: Number,
  splitTimes: [Number],
  cadence: Number,
  trunkAngleAvg: Number,
  trunkAngleMin: Number,
  trunkAngleMax: Number,
  distanceKm: Number,
  durationSec: Number,
  paceMinPerKm: Number,
  videoUrl: String,
  createdAt: { type: Date, default: Date.now },
});

// Prevent model overwrite issues in dev/hot reload
export default (mongoose.models?.Result as mongoose.Model<IResult>) ||
  model<IResult>("Result", ResultSchema);

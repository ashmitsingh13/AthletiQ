import mongoose, { Schema, Document } from "mongoose";

export interface IProfile extends Document {
  userId: mongoose.Types.ObjectId;
  name?: string;
  age?: number;
  gender?: string;
  sport?: string;
  state?: string;
  profileImage?: string;
}

const ProfileSchema = new Schema<IProfile>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    name: { type: String },
    age: { type: Number },
    gender: { type: String },
    sport: { type: String },
    state: { type: String },
    profileImage: { type: String, default: "/defaultImg.png" },
  },
  { timestamps: true }
);

export default mongoose.models.Profile || mongoose.model<IProfile>("Profile", ProfileSchema);

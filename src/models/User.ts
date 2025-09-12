import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  firstName?: string;
  lastName?: string;
  name?: string;
  username?: string;
  email: string;
  password?: string;
  dob?: Date;
  weight?: number;
  gender?: string;
  country?: string;
  state?: string;
  district?: string;
  documentType?: string;
  documentNumber?: string;
  imageUrl?: string | null;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    name: { type: String, trim: true },
    username: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: { type: String, required: true },
    dob: { type: Date },
    weight: { type: Number },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"], // match case exactly
      required: true,
    },
    country: { type: String },
    state: { type: String },
    district: { type: String },
    documentType: { type: String },
    documentNumber: { type: String },
    imageUrl: { type: String, default: null },
    phone: { type: String },
  },
  { timestamps: true }
);

UserSchema.virtual("fullName").get(function (this: IUser) {
  if (this.name) return this.name;
  const first = this.firstName || "";
  const last = this.lastName || "";
  return (first + " " + last).trim() || undefined;
});

UserSchema.set("toJSON", {
  virtuals: true,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret.password;
    return ret;
  },
});

export default mongoose.models.User ||
  mongoose.model<IUser>("User", UserSchema);

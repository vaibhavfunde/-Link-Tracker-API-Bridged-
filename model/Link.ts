// src/schemas/link.schema.ts
import { Schema, model, Document, Types, models } from "mongoose";

export interface ILink extends Document {
  longUrl: string;
  shortCode: string;
  createdBy?: Types.ObjectId;
  customAlias?: string;
  expiresAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const linkSchema = new Schema<ILink>(
  {
    longUrl: {
      type: String,
      required: true,
      trim: true,
    },
    shortCode: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    customAlias: {
      type: String,
      unique: true,
      sparse: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    expiresAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

const Link = models?.Link || model<ILink>("Link", linkSchema);
export default Link;

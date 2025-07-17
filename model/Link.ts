// src/schemas/link.schema.ts
import { Schema, model, Document, Types, models } from "mongoose";

// Subdocument type for analytics
const analyticsSchema = new Schema(
  {
    timestamp: {
      type: Date,
      default: Date.now,
    },
    userAgent: String,
    referrer: String,
    ip: String,
    country: String,
  },
  { _id: false }
);

// Main link document
export interface ILink extends Document {
  longUrl: string;
  shortCode: string;
  customAlias?: string;
  createdBy?: Types.ObjectId;
  expiresAt?: Date;
  analytics?: Array<{
    timestamp: Date;
    userAgent: string;
    referrer?: string;
    ip: string;
    country?: string;
  }>;
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
    analytics: [analyticsSchema], // Embedded analytics array
  },
  { timestamps: true }
);

const Link = models?.Link || model<ILink>("Link", linkSchema);
export default Link;

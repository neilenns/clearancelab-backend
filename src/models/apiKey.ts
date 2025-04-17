import mongoose, { Schema, Document, Model } from "mongoose";

// Define the interface for the document
export interface ApiKeyDocument extends Document {
  notes?: string;
  isActive: boolean;
}

// Define the schema
const ApiKeySchema = new Schema<ApiKeyDocument>(
  {
    notes: { type: String },
    isActive: { type: Boolean, default: true },
  },
  {
    collection: "apikeys", // Custom collection name
  }
);

// Create the model
export const ApiKeyModel: Model<ApiKeyDocument> =
  mongoose.model<ApiKeyDocument>("ApiKey", ApiKeySchema);

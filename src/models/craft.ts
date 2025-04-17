import { Document, Model, Schema, model } from "mongoose";

export interface CraftData {
  altitude?: string;
  clearanceLimit?: string;
  controllerName?: string;
  frequency?: string;
  route?: string;
  telephony?: string;
  transponder?: string;
}

// The document type includes both the data and instance methods (if any)
export interface CraftDocument extends CraftData, Document {}

// The model type includes static methods
export interface CraftModelType extends Model<CraftDocument> {
  findByController(controllerName: string): Promise<CraftDocument[]>;
}

// Schema
export const CraftSchema = new Schema<CraftDocument, CraftModelType>({
  altitude: { type: String, trim: true },
  clearanceLimit: { type: String, trim: true },
  controllerName: { type: String, trim: true },
  frequency: { type: String, trim: true },
  route: { type: String, trim: true },
  telephony: { type: String, trim: true },
  transponder: { type: String, trim: true },
});

// Model
export const CraftModel = model<CraftDocument, CraftModelType>(
  "Craft",
  CraftSchema
);

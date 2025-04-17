import { Document, Model, model, Schema, ValidatorProps } from "mongoose";

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
export type CraftModelType = Model<CraftDocument>;

// Schema
export const CraftSchema = new Schema<CraftDocument, CraftModelType>({
  altitude: { type: String, trim: true },
  clearanceLimit: { type: String, trim: true },
  controllerName: { type: String, trim: true },
  frequency: {
    type: String,
    trim: true,
    validate: {
      validator: (v: string) => /^\d{3}\.\d{2,3}$/.test(v),
      message: (props: ValidatorProps) =>
        `${props.value as string} is not a valid frequency format.`,
    },
  },
  route: { type: String, trim: true },
  telephony: { type: String, trim: true },
  transponder: {
    type: String,
    trim: true,
    validate: {
      validator: (v: string) => /^\d{4}$/.test(v),
      message: (props: ValidatorProps) =>
        `${props.value as string} is not a valid transponder code.`,
    },
  },
});

// Model
export const CraftModel = model<CraftDocument, CraftModelType>(
  "Craft",
  CraftSchema
);

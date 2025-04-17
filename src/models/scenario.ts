import { Document, Model, Schema, model } from "mongoose";
import { CraftData } from "./craft.js";
import { FlightPlanData } from "./flightPlan.js";

// Schema data interface
export interface ScenarioData {
  plan: FlightPlanData;
  craft?: CraftData;
  problems?: string[];
  isValid?: boolean;
}

// Full document type
export interface ScenarioDocument extends ScenarioData, Document {}

// Static method interface
export interface ScenarioModelType extends Model<ScenarioDocument> {
  findScenarioById(id: string): Promise<ScenarioDocument | null>;
  findAll(): Promise<ScenarioDocument[]>;
}

// Define schema
const ScenarioSchema = new Schema<ScenarioDocument, ScenarioModelType>(
  {
    plan: { type: Schema.Types.ObjectId, ref: "FlightPlan", required: true },
    craft: { type: Schema.Types.ObjectId, ref: "Craft" },
    problems: [{ type: String }],
    isValid: { type: Boolean },
  },
  {
    collection: "scenarios",
    timestamps: true,
  }
);

// Static methods
ScenarioSchema.statics.findScenarioById = function (
  id: string
): Promise<ScenarioDocument | null> {
  try {
    return this.findById(id).lean().exec();
  } catch (error) {
    console.error(`Error finding scenario with ID ${id}:`, error);
    return Promise.resolve(null);
  }
};

ScenarioSchema.statics.findAll = function (): Promise<ScenarioDocument[]> {
  return this.find({}).lean().exec();
};

// Export model
export const ScenarioModel = model<ScenarioDocument, ScenarioModelType>(
  "Scenario",
  ScenarioSchema
);

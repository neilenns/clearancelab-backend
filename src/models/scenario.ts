import { Document, Model, Schema, model } from "mongoose";
import { CraftData } from "./craft.js";
import { FlightPlanData } from "./flightPlan.js";
import { nanoid } from "nanoid";

// Schema data interface
export interface ScenarioData {
  _id: string;
  plan: FlightPlanData;
  craft?: CraftData;
  problems?: string[];
  isValid?: boolean;
}

// Full document type
export interface ScenarioDocument
  extends Omit<ScenarioData, "_id">,
    Document<string> {
  _id: string;
}

// Static method interface
export interface ScenarioModelType extends Model<ScenarioDocument> {
  findScenarioById(id: string): Promise<ScenarioDocument | null>;
  findAll(): Promise<ScenarioDocument[]>;
}

// Define schema
const ScenarioSchema = new Schema<ScenarioDocument, ScenarioModelType>(
  {
    _id: {
      type: String,
      default: () => nanoid(9),
    },
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

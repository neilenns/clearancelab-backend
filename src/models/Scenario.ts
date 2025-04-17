import { Model, Schema, Types, model } from "mongoose";
import { logger } from "../lib/logger.js";
import "./AirportInfo.js";

// Combined schema data interface
export interface ScenarioData {
  _id: Types.ObjectId;
  plan: {
    pilotName?: string;
    aid: string;
    vatsimId?: number;
    cid?: number;
    typ: string;
    eq: string;
    bcn?: number;
    dep: string;
    dest: string;
    spd?: number;
    alt: number;
    rte: string;
    rmk?: string;
    raw?: string;
    airportConditions?: string;
  };
  craft?: {
    altitude?: string;
    clearanceLimit?: string;
    controllerName?: string;
    frequency?: string;
    route?: string;
    telephony?: string;
    transponder?: string;
  };
  problems?: string[];
  isValid?: boolean;
}

// Static method interface
export interface ScenarioModelType extends Model<ScenarioData> {
  findScenarioById(id: string): Promise<ScenarioData | null>;
  findAll(): Promise<ScenarioData[]>;
}

// Define schema
const ScenarioSchema = new Schema<ScenarioData, ScenarioModelType>(
  {
    plan: {
      pilotName: { type: String },
      aid: { type: String, required: true },
      vatsimId: { type: Number },
      cid: { type: Number },
      typ: { type: String, required: true },
      eq: { type: String, required: true },
      bcn: { type: Number },
      dep: { type: String, required: true },
      dest: { type: String, required: true },
      spd: { type: Number },
      alt: {
        type: Number,
        required: true,
        min: [0, "Altitude cannot be negative"],
      },
      rte: { type: String, required: true },
      rmk: { type: String },
      raw: { type: String },
      airportConditions: { type: String },
    },
    craft: {
      altitude: { type: String, trim: true },
      clearanceLimit: { type: String, trim: true },
      controllerName: { type: String, trim: true },
      frequency: {
        type: String,
        trim: true,
        validate: {
          validator: (v: string) => /^\d{3}\.\d{2,3}$/.test(v),
          message: (props: { value: string }) =>
            `${props.value} is not a valid frequency format.`,
        },
      },
      route: { type: String, trim: true },
      telephony: { type: String, trim: true },
      transponder: {
        type: String,
        trim: true,
        validate: {
          validator: (v: string) => /^\d{4}$/.test(v),
          message: (props: { value: string }) =>
            `${props.value} is not a valid transponder code.`,
        },
      },
    },
    problems: [{ type: String }],
    isValid: { type: Boolean },
  },
  {
    collection: "scenarios",
    timestamps: true,
  }
);

// Add a virtual field for airportInfo
ScenarioSchema.virtual("airportInfo", {
  ref: "AirportInfo", // The model to use
  localField: "plan.dep", // Field in Scenario to match
  foreignField: "airportCode", // Field in AirportInfo to match
  justOne: true, // Only one airport info per scenario
});

// Ensure virtuals are included when converting to JSON or Object
ScenarioSchema.set("toObject", { virtuals: true });
ScenarioSchema.set("toJSON", { virtuals: true });

// Static methods
ScenarioSchema.statics.findScenarioById = function (
  id: string
): Promise<ScenarioData | null> {
  try {
    return this.findById(id)
      .populate("airportInfo") // Populate the airportInfo field
      .lean()
      .exec();
  } catch (error) {
    logger.error(`Error finding scenario with ID ${id}:`, error);
    return Promise.resolve(null);
  }
};

ScenarioSchema.statics.findAll = function (): Promise<ScenarioData[]> {
  return this.find({}).lean().exec();
};

// Export model
export const ScenarioModel = model<ScenarioData, ScenarioModelType>(
  "Scenario",
  ScenarioSchema
);

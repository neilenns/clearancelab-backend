import { Model, Schema, Types, model } from "mongoose";
import { logger } from "../lib/logger.js";
import "./AirportInfo.js";
import { AirportInfoData } from "./AirportInfo.js";
import mongooseLeanVirtuals from "mongoose-lean-virtuals";

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
  depAirportInfo?: AirportInfoData;
  destAirportInfo?: AirportInfoData;
  problems: {
    level: "info" | "warning" | "error";
    issue: string;
    solution: string;
  }[];
  isValid: boolean;
  canClear: boolean;
}

// Static method interface
export interface ScenarioModelType extends Model<ScenarioData> {
  findScenarioById(id: string): Promise<ScenarioData | null>;
  findAll(summary: boolean): Promise<ScenarioData[]>;
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
    problems: {
      type: [
        {
          level: {
            type: String,
            enum: ["info", "warning", "error"],
            required: true,
          },
          issue: { type: String, required: true },
          solution: { type: String, required: true },
        },
      ],
      default: [],
    },
  },
  {
    collection: "scenarios",
    timestamps: true,
  }
);

// Add a virtual field for departure airport information
ScenarioSchema.virtual("depAirportInfo", {
  ref: "AirportInfo", // The model to use
  localField: "plan.dep", // Field in Scenario to match
  foreignField: "airportCode", // Field in AirportInfo to match
  justOne: true, // Only one airport info per scenario
});

// Add a virtual field for destination airport information
ScenarioSchema.virtual("destAirportInfo", {
  ref: "AirportInfo", // The model to use
  localField: "plan.dest", // Field in Scenario to match
  foreignField: "airportCode", // Field in AirportInfo to match
  justOne: true, // Only one airport info per scenario
});

// Ensure virtuals are included when converting to JSON or Object
ScenarioSchema.set("toObject", { virtuals: true });
ScenarioSchema.set("toJSON", { virtuals: true });
ScenarioSchema.plugin(mongooseLeanVirtuals);

// Add virtuals for isValid and canClear based on whether there are problems.
ScenarioSchema.virtual("isValid").get(function () {
  return !this.problems.some((problem) => problem.level !== "info");
});

ScenarioSchema.virtual("canClear").get(function () {
  return !this.problems.some((problem) => problem.level === "error");
});

// Static methods
ScenarioSchema.statics.findScenarioById = function (
  id: string
): Promise<ScenarioData | null> {
  try {
    return this.findById(id)
      .populate("depAirportInfo") // Populate the departure airport info
      .populate("destAirportInfo") // Populate the destination airport info
      .lean({ virtuals: true })
      .exec();
  } catch (error) {
    logger.error(`Error finding scenario with ID ${id}:`, error);
    return Promise.resolve(null);
  }
};

ScenarioSchema.statics.findAll = async function (
  summary: boolean
): Promise<Partial<ScenarioData>[]> {
  if (summary) {
    // Results has to include "problems" so isValid and canClear can be calculated.
    const results = await this.find({})
      .select(
        "isValid canClear plan.dep plan.dest plan.aid createdAt updatedAt problems"
      )
      .lean({ virtuals: ["isValid", "canClear"] })
      .exec();

    // Strip out the problems field from the results after it was used to calculate isValid and canClear.
    return results.map(({ problems: _problems, ...rest }) => rest);
  }

  return this.find({})
    .populate("depAirportInfo") // Populate the departure airport info
    .populate("destAirportInfo") // Populate the destination airport info
    .lean({ virtuals: true })
    .exec();
};

// Export model
export const ScenarioModel = model<ScenarioData, ScenarioModelType>(
  "Scenario",
  ScenarioSchema
);

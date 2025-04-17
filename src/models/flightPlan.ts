import { Document, Model, Schema, model } from "mongoose";

export interface FlightPlanData {
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
}

// Document type for instance methods (if needed)
export interface FlightPlanDocument extends FlightPlanData, Document {}

// Model type for static methods
export interface FlightPlanModelType extends Model<FlightPlanDocument> {
  findByDeparture(dep: string): Promise<FlightPlanDocument[]>;
}

// Schema definition
export const FlightPlanSchema = new Schema<
  FlightPlanDocument,
  FlightPlanModelType
>({
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
});

// Export model
export const FlightPlanModel = model<FlightPlanDocument, FlightPlanModelType>(
  "FlightPlan",
  FlightPlanSchema
);

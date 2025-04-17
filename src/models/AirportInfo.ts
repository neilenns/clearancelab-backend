import mongoose, { Document, Schema } from "mongoose";

export interface IAirportInfo extends Document {
  airportCode: string;
  icaoCode?: string;
  iataCode?: string;
  name?: string;
  elevation?: number;
  city?: string;
  state?: string;
  longitude?: number;
  latitude?: number;
  timezone?: string;
  countryCode?: string;
}

const AirportInfoSchema: Schema = new Schema(
  {
    airportCode: {
      type: String,
      required: true,
      unique: true,
      index: true,
      alias: "airport_code",
    },
    icaoCode: { type: String, alias: "code_icao" },
    iataCode: { type: String, alias: "code_iata" },
    name: { type: String },
    elevation: { type: Number },
    city: { type: String },
    state: { type: String },
    longitude: { type: Number },
    latitude: { type: Number },
    timezone: { type: String },
    countryCode: { type: String, alias: "country_code" },
  },
  {
    collection: "airportinfo",
  }
);

export const AirportInfo = mongoose.model<IAirportInfo>(
  "AirportInfo",
  AirportInfoSchema
);

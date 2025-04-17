import { getModelForClass, prop } from "@typegoose/typegoose";

export class Craft {
  @prop({ trim: true }) telephony?: string;
  @prop({ trim: true }) clearanceLimit?: string;
  @prop({ trim: true }) route?: string;
  @prop({ trim: true }) altitude?: string;
  @prop({ trim: true }) frequency?: string;
  @prop({ trim: true }) transponder?: string;
  @prop({ trim: true }) controllerName?: string;
}

export const CraftModel = getModelForClass(Craft);

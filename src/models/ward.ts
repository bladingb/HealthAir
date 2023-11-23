import { Model, ObjectId, Schema, model, models } from "mongoose";

export interface WardDocument {
  users: ObjectId[];
  facility: string;
  department: string;
  wardName: string[];
  phoneNumber: string;
  howToFind?: string;
  parking?: string;
  note?: string;
  cautions?: string;
}

const WardSchema = new Schema<WardDocument>({
  users: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  facility: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  department: {
    type: String,
    required: true,
    trim: true,
  },
  wardName: [{
    type: String,
    required: true,
    trim: true,
  }],
  phoneNumber: {
    type: String,
    trim: true,
    required: true,
  },
  howToFind: {
    type: String,
    trim: true,
  },
  parking: {
    type: String,
    trim: true,
  },
  note: {
    type: String,
    trim: true,
  },
  cautions: {
    type: String,
    trim: true,
  },
});

export default model("Ward", WardSchema) as Model<WardDocument>;

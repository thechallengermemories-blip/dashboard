import mongoose, { Schema, models, model } from 'mongoose';

export interface ICrewMember {
  slug: string;
  name: string;
  role: string;
  crewId: string;
  seat: string;
  img: string;
  shortBio: string;
  rawBiography?: string;
  media?: string[];
}

const CrewMemberSchema = new Schema<ICrewMember>(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      trim: true,
    },
    crewId: {
      type: String,
      required: true,
      trim: true,
    },
    seat: {
      type: String,
      required: true,
      trim: true,
    },
    img: {
      type: String,
      required: true,
    },
    shortBio: {
      type: String,
      required: true,
    },
    rawBiography: {
      type: String,
    },
    media: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

export const CrewMember =
  models.CrewMember || model<ICrewMember>('CrewMember', CrewMemberSchema);
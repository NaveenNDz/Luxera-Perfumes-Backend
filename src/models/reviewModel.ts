import { Schema, model, Document } from "mongoose";

export interface IReview extends Document {
  productId: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
}

const reviewSchema = new Schema<IReview>(
  {
    productId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Review = model<IReview>("Review", reviewSchema);
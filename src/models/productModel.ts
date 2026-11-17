import { Schema, model, Document } from "mongoose";

export interface IProduct extends Document {
  number: string;
  name: string;
  brand: string;
  category: "Men" | "Women" | "Unisex";
  suitability: "Day" | "Evening" | "Both";
  function: "Wedding" | "Date Nights" | "Office" | "Parties" | "All Functions";
  concentration: string;
  price: number;
  volume: string;
  batch: string;
  image: string;
  description: string;
  stock: number;
}

const productSchema = new Schema<IProduct>(
  {
    number: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["Men", "Women", "Unisex"],
      required: true,
    },
    suitability: {
      type: String,
      enum: ["Day", "Evening", "Both"],
      required: true,
    },
    function: {
      type: String,
      enum: ["Wedding", "Date Nights", "Office", "Parties", "All Functions"],
      required: true,
    },
    concentration: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    volume: {
      type: String,
      required: true,
    },
    batch: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
      default: 50,
    },
  },
  { timestamps: true }
);

export const Product = model<IProduct>("Product", productSchema);
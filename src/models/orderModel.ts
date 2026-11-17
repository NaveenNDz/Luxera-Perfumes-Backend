import { Schema, model, Document } from "mongoose";

export interface IOrder extends Document {
  customer: string;
  email: string;
  salon: string;
  flacon: string;
  quantity: number;
  total: number;
  status: string;
  date: string;
}

const orderSchema = new Schema<IOrder>(
  {
    customer: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    salon: {
      type: String,
      required: true,
    },
    flacon: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      default: "Pending",
    },
    date: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Order = model<IOrder>("Order", orderSchema);
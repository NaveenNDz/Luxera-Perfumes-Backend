import { Schema, model, Document } from "mongoose";

export interface IOrder extends Document {
  customer: string;
  email: string;
  phone?: string;
  address?: string;
  paymentMethod?: string;
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
    phone: {
      type: String,
      default: "",
    },
    address: {
      type: String,
      default: "",
    },
    paymentMethod: {
      type: String,
      default: "Cash on delivery",
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
      default: () =>
        new Date().toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
    },
  },
  { timestamps: true }
);

export const Order = model<IOrder>("Order", orderSchema);

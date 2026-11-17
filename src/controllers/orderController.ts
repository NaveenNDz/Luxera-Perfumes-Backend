import { Request, Response } from "express";
import { Order } from "../models/orderModel";

export const getOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching orders",
    });
  }
};

export const createOrder = async (req: Request, res: Response) => {
  try {
    const order = new Order(req.body);
    const savedOrder = await order.save();

    res.status(201).json({
      success: true,
      data: savedOrder,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error placing order",
    });
  }
};
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
    const orderData = {
      ...req.body,
      date:
        req.body.date ||
        new Date().toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
    };

    const order = new Order(orderData);
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

export const updateOrder = async (req: Request, res: Response) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      data: updatedOrder,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating order",
    });
  }
};

export const getCustomers = async (req: Request, res: Response) => {
  try {
    const customers = await Order.aggregate([
      {
        $group: {
          _id: { $toLower: "$email" },
          name: { $first: "$customer" },
          email: { $first: "$email" },
          salon: { $first: "$salon" },
          ordersCount: { $sum: 1 },
          totalSpend: { $sum: "$total" },
          lastDate: { $last: "$date" },
        },
      },
      { $sort: { totalSpend: -1 } },
    ]);

    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching customers",
    });
  }
};

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrder = exports.getOrders = void 0;
const orderModel_1 = require("../models/orderModel");
const getOrders = async (req, res) => {
    try {
        const orders = await orderModel_1.Order.find().sort({ createdAt: -1 });
        res.status(200).json(orders);
    }
    catch (error) {
        res.status(500).json({
            message: "Error fetching orders",
        });
    }
};
exports.getOrders = getOrders;
const createOrder = async (req, res) => {
    try {
        const order = new orderModel_1.Order(req.body);
        const savedOrder = await order.save();
        res.status(201).json({
            success: true,
            data: savedOrder,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Error placing order",
        });
    }
};
exports.createOrder = createOrder;

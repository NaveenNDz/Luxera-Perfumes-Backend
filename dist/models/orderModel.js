"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
const mongoose_1 = require("mongoose");
const orderSchema = new mongoose_1.Schema({
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
}, { timestamps: true });
exports.Order = (0, mongoose_1.model)("Order", orderSchema);

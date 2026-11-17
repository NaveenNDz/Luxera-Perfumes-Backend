"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
const mongoose_1 = require("mongoose");
const productSchema = new mongoose_1.Schema({
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
}, { timestamps: true });
exports.Product = (0, mongoose_1.model)("Product", productSchema);

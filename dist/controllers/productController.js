"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.scentQuiz = exports.getProductById = exports.getProducts = void 0;
const productModel_1 = require("../models/productModel");
const getProducts = async (req, res) => {
    try {
        const products = await productModel_1.Product.find().sort({ createdAt: -1 });
        res.status(200).json(products);
    }
    catch (error) {
        res.status(500).json({
            message: "Error fetching products",
        });
    }
};
exports.getProducts = getProducts;
const getProductById = async (req, res) => {
    try {
        const product = await productModel_1.Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({
                message: "Product not found",
            });
        }
        res.status(200).json(product);
    }
    catch (error) {
        res.status(500).json({
            message: "Error fetching product details",
        });
    }
};
exports.getProductById = getProductById;
const scentQuiz = async (req, res) => {
    try {
        const { gender, time, occasion } = req.body;
        let query = {};
        if (gender && gender !== "unisex") {
            let targetGender = gender === "men" ? "Men" : "Women";
            query.category = { $in: [targetGender, "Unisex"] };
        }
        if (time === "day") {
            query.suitability = { $in: ["Day", "Both"] };
        }
        if (time === "night") {
            query.suitability = { $in: ["Evening", "Both"] };
        }
        if (occasion === "wedding")
            query.function = "Wedding";
        if (occasion === "date")
            query.function = "Date Nights";
        if (occasion === "office")
            query.function = "Office";
        if (occasion === "party")
            query.function = "Parties";
        let products = await productModel_1.Product.find(query);
        if (products.length === 0) {
            products = await productModel_1.Product.find();
        }
        const matches = products.map((prod) => ({
            product: prod,
            matchScore: 95,
            reason: `Perfect match tailored for your selected ${occasion || "lifestyle"} preference.`,
        }));
        res.status(200).json({ matches });
    }
    catch (error) {
        res.status(500).json({
            message: "Error processing scent quiz",
        });
    }
};
exports.scentQuiz = scentQuiz;
const createProduct = async (req, res) => {
    try {
        const product = new productModel_1.Product(req.body);
        const savedProduct = await product.save();
        res.status(201).json(savedProduct);
    }
    catch (error) {
        res.status(500).json({
            message: "Error creating product",
        });
    }
};
exports.createProduct = createProduct;
const updateProduct = async (req, res) => {
    try {
        const updatedProduct = await productModel_1.Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedProduct);
    }
    catch (error) {
        res.status(500).json({
            message: "Error updating product",
        });
    }
};
exports.updateProduct = updateProduct;
const deleteProduct = async (req, res) => {
    try {
        await productModel_1.Product.findByIdAndDelete(req.params.id);
        res.status(200).json({
            message: "Product deleted successfully",
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Error deleting product",
        });
    }
};
exports.deleteProduct = deleteProduct;

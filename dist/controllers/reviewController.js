"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteReview = exports.addReview = exports.getProductReviews = void 0;
const reviewModel_1 = require("../models/reviewModel");
const getProductReviews = async (req, res) => {
    try {
        const reviews = await reviewModel_1.Review.find({ productId: req.params.productId }).sort({ createdAt: -1 });
        res.status(200).json(reviews);
    }
    catch (error) {
        res.status(500).json({
            message: "Error fetching reviews",
        });
    }
};
exports.getProductReviews = getProductReviews;
const addReview = async (req, res) => {
    try {
        const review = new reviewModel_1.Review({
            ...req.body,
            date: new Date().toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
            }),
        });
        const savedReview = await review.save();
        res.status(201).json(savedReview);
    }
    catch (error) {
        res.status(500).json({
            message: "Error adding review",
        });
    }
};
exports.addReview = addReview;
const deleteReview = async (req, res) => {
    try {
        await reviewModel_1.Review.findByIdAndDelete(req.params.id);
        res.status(200).json({
            message: "Review deleted successfully",
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Error deleting review",
        });
    }
};
exports.deleteReview = deleteReview;

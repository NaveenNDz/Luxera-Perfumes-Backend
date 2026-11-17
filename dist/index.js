"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const productRouter_1 = __importDefault(require("./routers/productRouter"));
const authRouter_1 = __importDefault(require("./routers/authRouter"));
const orderRouter_1 = __importDefault(require("./routers/orderRouter"));
const reviewRouter_1 = __importDefault(require("./routers/reviewRouter"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/luxera";
mongoose_1.default
    .connect(MONGO_URI)
    .then(() => {
    console.log("MongoDB Connected Successfully to LUXERA Database");
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
})
    .catch((error) => {
    console.log("Database connection error:", error);
});
app.use("/api/products", productRouter_1.default);
app.use("/api/auth", authRouter_1.default);
app.use("/api/orders", orderRouter_1.default);
app.use("/api/reviews", reviewRouter_1.default);
app.get("/", (req, res) => {
    res.send("LUXERA API Server is Running Successfully");
});

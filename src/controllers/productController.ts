import { Request, Response } from "express";
import { Product } from "../models/productModel";

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching products",
    });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching product details",
    });
  }
};

export const scentQuiz = async (req: Request, res: Response) => {
  try {
    const { gender, time, occasion } = req.body;
    let query: any = {};

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

    if (occasion === "wedding") query.function = "Wedding";
    if (occasion === "date") query.function = "Date Nights";
    if (occasion === "office") query.function = "Office";
    if (occasion === "party") query.function = "Parties";

    let products = await Product.find(query);

    if (products.length === 0) {
      products = await Product.find();
    }

    const matches = products.map((prod) => ({
      product: prod,
      matchScore: 95,
      reason: `Perfect match tailored for your selected ${
        occasion || "lifestyle"
      } preference.`,
    }));

    res.status(200).json({ matches });
  } catch (error) {
    res.status(500).json({
      message: "Error processing scent quiz",
    });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const product = new Product(req.body);
    const savedProduct = await product.save();

    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({
      message: "Error creating product",
    });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({
      message: "Error updating product",
    });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting product",
    });
  }
};
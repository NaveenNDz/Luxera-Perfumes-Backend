import { Request, Response } from "express";
import Product from "../models/productModel";

export async function getAllProducts(req: Request, res: Response) {
  try {
    const products = await Product.find({ isAvailable: true });
    res.json(products);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching products",
    });
  }
}

export async function createProduct(req: any, res: Response) {
  if (!req.user?.roles?.includes("ADMIN")) {
    return res.status(403).json({
      message: "Admins only",
    });
  }

  try {
    const newProduct = new Product(req.body);
    await newProduct.save();

    res.status(201).json({
      message: "Product created successfully",
      product: newProduct,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating product",
    });
  }
}

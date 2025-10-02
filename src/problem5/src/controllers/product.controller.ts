import { NextFunction, Request, Response } from "express";
import productService from "../services/product.service";
import {
  CreateProductDto,
  insertBodyShape,
  updateBodyShape,
  UpdateProductDto,
} from "../models/product.model";
import * as yup from "yup";
import { ERROR_MESSAGE } from "../shared/constants";

class ProductController {
  async getProductList(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { name, minPrice, limit, offset } = req.params;

      const products = await productService.getList(
        { name, minPrice: minPrice ? Number(minPrice) : undefined },
        {
          limit: limit ? Number(limit) : undefined,
          offset: offset ? Number(offset) : undefined,
        }
      );

      res.status(200).json(products);
    } catch (error) {
      next(error);
    }
  }

  async getProductById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const product = await productService.getDetail(id);
      res.status(200).json(product);
    } catch (error) {
      next(error);
    }
  }

  async createProduct(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      await yup
        .object(insertBodyShape)
        .validate(req.body, { abortEarly: false });

      const productData: CreateProductDto = req.body;
      const newProduct = await productService.create(productData);
      res.status(201).json(newProduct);
    } catch (error) {
      next(error);
    }
  }

  async updateProduct(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      await yup
        .object(updateBodyShape)
        .validate(req.body, { abortEarly: false });

      const productData: UpdateProductDto = req.body;
      const updatedProduct = await productService.update(id, productData);
      if (updatedProduct) {
        res.status(200).json(updatedProduct);
      } else {
        res
          .status(404)
          .json({ success: false, message: ERROR_MESSAGE.RESOURCE_NOT_FOUND });
      }
    } catch (error) {
      next(error);
    }
  }

  async deleteProduct(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await productService.delete(id);
      if (deleted) {
        res.status(204).send();
      } else {
        res
          .status(404)
          .json({ success: false, message: ERROR_MESSAGE.RESOURCE_NOT_FOUND });
      }
    } catch (error) {
      next(error);
    }
  }
}

export default new ProductController();

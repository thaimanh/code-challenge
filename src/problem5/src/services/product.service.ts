import {
  IProduct,
  CreateProductDto,
  UpdateProductDto,
} from "../models/product.model";
import { HTTPError } from "../shared/errors";
import productDAO from "../daos/product.dao";
import { IResponseCommon, IResponseSuccess } from "../models/base.model";
import STT from "http-status";
import { ERROR_MESSAGE } from "../shared/constants";

interface ISearchProductParams {
  name?: string;
  minPrice?: number;
  maxPrice?: number;
}

interface IPaginationParams {
  limit?: number;
  offset?: number;
}

class ProductService {
  async getList(
    params: ISearchProductParams,
    pagination: IPaginationParams
  ): Promise<IResponseCommon<IProduct[]>> {
    const { name, minPrice } = params;
    const { limit = 10, offset = 0 } = pagination;

    const [list, total] = await Promise.all([
      productDAO.getMany(
        { name, delFlg: undefined, price: [">=", minPrice] },
        {
          limit,
          offset,
        }
      ),
      productDAO.getTotal({ name, price: [">=", minPrice] }),
    ]);

    return {
      result: list,
      meta: {
        total,
        offset,
        limit,
      },
    };
  }

  async getDetail(id: string): Promise<IResponseCommon<IProduct>> {
    const product = await productDAO.getOne({ id: id });

    if (!product) {
      throw new HTTPError(ERROR_MESSAGE.RESOURCE_NOT_FOUND, STT.NOT_FOUND);
    }

    return {
      result: product,
      meta: {},
    };
  }

  async create(data: CreateProductDto): Promise<IResponseSuccess> {
    try {
      await productDAO.add(data);
      return { success: true };
    } catch (error) {
      console.error("Error creating product:", error);
      throw new HTTPError(
        ERROR_MESSAGE.RESOURCE_CREATION_FAILED,
        STT.INTERNAL_SERVER_ERROR
      );
    }
  }

  async update(
    id: string,
    productData: UpdateProductDto
  ): Promise<IResponseSuccess> {
    try {
      await productDAO.update({ id }, productData);
      return { success: true };
    } catch (error) {
      console.error("Error updating product:", error);
      throw new HTTPError(
        ERROR_MESSAGE.RESOURCE_UPDATE_FAILED,
        STT.INTERNAL_SERVER_ERROR
      );
    }
  }

  async delete(id: string): Promise<IResponseSuccess> {
    try {
      await productDAO.delete({ id });
      return { success: true };
    } catch (error) {
      console.error("Error deleting product:", error);
      throw new HTTPError(
        ERROR_MESSAGE.RESOURCE_UPDATE_FAILED,
        STT.INTERNAL_SERVER_ERROR
      );
    }
  }
}

export default new ProductService();

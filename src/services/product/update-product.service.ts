import { mustBeObjectId, ProductError, mustExist, Product, makeSure, ModifiedService, modifiedSelect, convertToSave } from "../../../src/refs";

export interface UpdateProductInput {
    name: string;
    suggestedRetailerPrice: number;
    unit: string;
    origin?: string;
    cost?: number;
}

export class UpdateProductService {
    static async validate(productId: string, userId: string, updateProductInput: UpdateProductInput) {
        const { name, suggestedRetailerPrice, origin, unit, cost } = updateProductInput;
        mustBeObjectId(productId, userId);
        mustExist(name, ProductError.NAME_MUST_BE_PROVIDED);
        mustExist(unit, ProductError.UNIT_MUST_BE_PROVIDED);
        mustExist(suggestedRetailerPrice, ProductError.SUGGESTED_RETAILER_PRICE_MUST_BE_PROVIDED);
        const oldProduct = await Product.findById(productId).select(modifiedSelect);
        mustExist(oldProduct, ProductError.CANNOT_FIND_PRODUCT);
        const checkUniqueName = await Product.count({ name, _id: { $ne: productId } });
        makeSure(checkUniqueName === 0, ProductError.NAME_IS_EXISTED);
        return oldProduct;
    }

    static async update(productId: string, userId: string, updateProductInput: UpdateProductInput) {
        let { name, suggestedRetailerPrice, origin, unit, cost } = updateProductInput;
        if (!cost) cost = 0;
        const oldProduct = await this.validate(productId, userId, updateProductInput) as Product;
        await Product.findByIdAndUpdate(productId, {
            name: convertToSave(name),
            suggestedRetailerPrice: convertToSave(suggestedRetailerPrice),
            origin: convertToSave(origin),
            unit: convertToSave(unit),
            cost
        }, { new: true });
        return await ModifiedService.product(productId, userId, oldProduct);
    }
}
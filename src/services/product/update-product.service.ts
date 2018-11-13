import { mustBeObjectId, ProductError, mustExist, Product, makeSure, ModifiedService, modifiedSelect } from "../../../src/refs";

export class UpdateProductService {
    static async validate(productId: string, userId: string, name: string, suggestedRetailerPrice: number, origin: string, unit: string,  cost: number) {
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

    static async update(productId: string, userId: string, name: string, suggestedRetailerPrice: number, origin: string, unit: string, cost: number) {
        if (!cost) cost = 0;
        const oldProduct = await this.validate(productId, userId, name, suggestedRetailerPrice, origin, unit, cost) as Product;
        await Product.findByIdAndUpdate(productId, { name, suggestedRetailerPrice, origin, cost, unit }, { new: true });
        return await ModifiedService.product(productId, userId, oldProduct);
    }
}
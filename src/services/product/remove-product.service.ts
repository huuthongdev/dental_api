import { mustBeObjectId, ProductError, mustExist, Product, makeSure, ModifiedService, modifiedSelect } from "../../../src/refs";

export class RemoveProductService {
    static async validate(productId: string, userId?: string) {
        mustBeObjectId(productId);
        if (userId) mustBeObjectId(userId);
        const oldProduct = await Product.findById(productId).select(modifiedSelect) as Product;
        mustExist(oldProduct, ProductError.CANNOT_FIND_PRODUCT);
        return oldProduct;
    }

    static async remove(productId: string) {
        await this.validate(productId);
        return await Product.findByIdAndRemove(productId);
    }

    static async disable(productId: string, userId: string) {
        const oldProduct = await this.validate(productId, userId);
        await Product.findByIdAndUpdate(productId, { isActive: false }, { new: true });
        return ModifiedService.product(productId, userId, oldProduct);
    }

    static async enable(productId: string, userId: string) {
        const oldProduct = await this.validate(productId, userId);
        await Product.findByIdAndUpdate(productId, { isActive: true }, { new: true });
        return ModifiedService.product(productId, userId, oldProduct);
    }
}
import { mustBeObjectId, mustExist, Product, makeSure, SID_START_AT } from "../../../src/refs";
import { ProductError } from "./product.errors";

export class CreateProductService {
    static async validate(userId: string, name: string, suggestedRetailerPrice: number, unit: string, origin: string) {
        mustBeObjectId(userId);
        mustExist(name, ProductError.NAME_MUST_BE_PROVIDED);
        mustExist(unit, ProductError.UNIT_MUST_BE_PROVIDED);
        mustExist(suggestedRetailerPrice, ProductError.SUGGESTED_RETAILER_PRICE_MUST_BE_PROVIDED);
        const checkUniqueName = await Product.count({ name });
        makeSure(checkUniqueName === 0, ProductError.NAME_IS_EXISTED);
    }

    static async create(userId: string, name: string, suggestedRetailerPrice: number, origin: string, unit: string, cost?: number) {
        await this.validate(userId, name, suggestedRetailerPrice, unit, origin);
        const sid = await this.getSid();
        const product = new Product({ sid, name, suggestedRetailerPrice, origin, createBy: userId, cost, unit });
        return await product.save();
    }

    static async getSid() {
        const maxSid = await Product.find({}).sort({ sid: -1 }).limit(1) as Product[];
        if (maxSid.length === 0) return SID_START_AT;
        return maxSid[0].sid + 1;
    }
}
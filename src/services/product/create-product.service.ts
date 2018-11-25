import { mustBeObjectId, mustExist, Product, makeSure, SID_START_AT, convertToSave } from "../../../src/refs";
import { ProductError } from "./product.errors";

export interface CreateProductInput {
    name: string;
    suggestedRetailerPrice: number;
    unit: string;
    origin?: string;
    cost?: number;
}

export class CreateProductService {
    static async validate(userId: string, createProductInput: CreateProductInput) {
        const { name, suggestedRetailerPrice, unit, origin, cost } = createProductInput;
        mustBeObjectId(userId);
        mustExist(name, ProductError.NAME_MUST_BE_PROVIDED);
        mustExist(unit, ProductError.UNIT_MUST_BE_PROVIDED);
        mustExist(suggestedRetailerPrice, ProductError.SUGGESTED_RETAILER_PRICE_MUST_BE_PROVIDED);
        const checkUniqueName = await Product.count({ name });
        makeSure(checkUniqueName === 0, ProductError.NAME_IS_EXISTED);
    }

    static async create(userId: string, createProductInput: CreateProductInput) {
        let { name, suggestedRetailerPrice, unit, origin, cost } = createProductInput;
        if (!cost) cost = 0;
        await this.validate(userId, createProductInput);
        const sid = await this.getSid();
        const product = new Product({
            sid,
            name: convertToSave(name),
            suggestedRetailerPrice: convertToSave(suggestedRetailerPrice),
            origin: convertToSave(origin),
            createBy: userId,
            unit: convertToSave(unit),
            cost: convertToSave(cost)
        });
        return await product.save();
    }

    static async getSid() {
        const maxSid = await Product.find({}).sort({ sid: -1 }).limit(1) as Product[];
        if (maxSid.length === 0) return SID_START_AT;
        return maxSid[0].sid + 1;
    }
}
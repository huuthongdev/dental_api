import { AccessorieItem, mustExist, ServiceError, Service, makeSure } from "../../../src/refs";

export class CreateService {
    static async validate(name: string, suggestedRetailerPrice: number, basicProcedure: string[], accessories: AccessorieItem[]) {
        mustExist(suggestedRetailerPrice, ServiceError.SUGGESTED_RETAILER_PRICE_MUST_BE_PROVIDED);
        mustExist(name, ServiceError.NAME_MUST_BE_PROVIDED);    
        const checkNameUnique = await Service.count({ name });
        makeSure(checkNameUnique === 0, ServiceError.NAME_IS_EXISTED);
    }

    static async create(userId: string, name: string, suggestedRetailerPrice: number, basicProcedure: string[], accessories: AccessorieItem[]) {
        await this.validate(name, suggestedRetailerPrice, basicProcedure, accessories);
        const sid = await this.getSid();
        const service = new Service({
            sid, name, suggestedRetailerPrice, basicProcedure, accessories, createBy: userId
        });
        return await service.save();
    }

    static async getSid() {
        const sid = await Service.count({}) + 1;
        return sid;
    }
}
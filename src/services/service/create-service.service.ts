import { AccessorieItem, mustExist, ServiceError, Service, makeSure, SID_START_AT } from "../../../src/refs";

export class CreateService {
    static async validate(name: string, suggestedRetailerPrice: number, basicProcedure: string[], accessories: AccessorieItem[], unit: string) {
        mustExist(suggestedRetailerPrice, ServiceError.SUGGESTED_RETAILER_PRICE_MUST_BE_PROVIDED);
        mustExist(name, ServiceError.NAME_MUST_BE_PROVIDED);
        mustExist(unit, ServiceError.UNIT_MUST_BE_PROVIDED);
        const checkNameUnique = await Service.count({ name });
        makeSure(checkNameUnique === 0, ServiceError.NAME_IS_EXISTED);
    }

    static async create(userId: string, name: string, suggestedRetailerPrice: number, basicProcedure: string[], accessories: AccessorieItem[], unit: string, cost: number) {
        await this.validate(name, suggestedRetailerPrice, basicProcedure, accessories, unit);
        const sid = await this.getSid();
        const service = new Service({ sid, name, suggestedRetailerPrice, basicProcedure, accessories, createBy: userId, unit, cost });
        await service.save();
        return await this.getServiceInfo(service._id);
    }

    static async getSid() {
        const maxSid = await Service.find({}).sort({ sid: -1 }).limit(1) as Service[];
        if (maxSid.length === 0) return SID_START_AT;
        return maxSid[0].sid + 1;
    }

    static async getServiceInfo(serviceId: string) {
        return await Service.findById(serviceId).populate({
            path: 'accessories.product',
            select: 'name sid cost'
        }).exec();
    }
}
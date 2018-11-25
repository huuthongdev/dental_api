import { AccessorieItem, mustExist, ServiceError, Service, makeSure, SID_START_AT, mustBeObjectId, convertToSave } from "../../../src/refs";

export interface CreateServiceInput {
    name: string;
    suggestedRetailerPrice: number;
    basicProcedure?: string[];
    accessories?: AccessorieItem[];
    unit: string;
}

export class CreateService {
    static async validate(userId: string, createServiceInput: CreateServiceInput) {
        mustBeObjectId(userId);
        const { name, suggestedRetailerPrice, basicProcedure, accessories, unit } = createServiceInput;
        mustExist(suggestedRetailerPrice, ServiceError.SUGGESTED_RETAILER_PRICE_MUST_BE_PROVIDED);
        mustExist(name, ServiceError.NAME_MUST_BE_PROVIDED);
        mustExist(unit, ServiceError.UNIT_MUST_BE_PROVIDED);
        const checkNameUnique = await Service.count({ name });
        makeSure(checkNameUnique === 0, ServiceError.NAME_IS_EXISTED);
    }

    static async create(userId: string, createServiceInput: CreateServiceInput) {
        const { name, suggestedRetailerPrice, basicProcedure, accessories, unit } = createServiceInput;
        await this.validate(userId, createServiceInput);
        const sid = await this.getSid();
        const service = new Service({
            sid,
            name: convertToSave(name),
            suggestedRetailerPrice: convertToSave(suggestedRetailerPrice),
            basicProcedure: convertToSave(basicProcedure),
            accessories: convertToSave(accessories),
            createBy: userId,
            unit: convertToSave(unit)
        });
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
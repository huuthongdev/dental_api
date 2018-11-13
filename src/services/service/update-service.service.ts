import { AccessorieItem, mustExist, ServiceError, Service, makeSure, ModifiedService } from "../../../src/refs";

export class UpdateService {
    static async validate(userId: string, serviceId: string, name: string, suggestedRetailerPrice: number, basicProcedure: string[], accessories: AccessorieItem[], unit: string) {
        mustExist(userId, serviceId);
        mustExist(suggestedRetailerPrice, ServiceError.SUGGESTED_RETAILER_PRICE_MUST_BE_PROVIDED);
        mustExist(name, ServiceError.NAME_MUST_BE_PROVIDED);
        mustExist(unit, ServiceError.UNIT_MUST_BE_PROVIDED);
        const oldService = await Service.findById(serviceId);
        mustExist(oldService, ServiceError.CANNOT_FIND_SERVICE);
        const checkNameUnique = await Service.count({ name, _id: { $ne: serviceId } });
        makeSure(checkNameUnique === 0, ServiceError.NAME_IS_EXISTED);
        return oldService;
    }

    static async update(userId: string, serviceId: string, name: string, suggestedRetailerPrice: number, basicProcedure: string[], accessories: AccessorieItem[], unit: string, cost: number) {
        const oldService = await this.validate(userId, serviceId, name, suggestedRetailerPrice, basicProcedure, accessories, unit) as Service;
        await Service.findByIdAndUpdate(serviceId, { name, suggestedRetailerPrice, basicProcedure, accessories, unit, cost });
        return await ModifiedService.service(serviceId, userId, oldService);
    }
}
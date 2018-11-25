import { AccessorieItem, mustExist, ServiceError, Service, makeSure, ModifiedService, convertToSave } from "../../../src/refs";

export interface UpdateServiceInput {
    name: string;
    suggestedRetailerPrice: number;
    basicProcedure?: string[];
    accessories?: AccessorieItem[];
    unit: string;
}
export class UpdateService {
    static async validate(userId: string, serviceId: string, updateServiceInput: UpdateServiceInput) {
        const { name, suggestedRetailerPrice, basicProcedure, accessories, unit } = updateServiceInput;
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

    static async update(userId: string, serviceId: string, updateServiceInput: UpdateServiceInput) {
        const { name, suggestedRetailerPrice, basicProcedure, accessories, unit } = updateServiceInput;
        const oldService = await this.validate(userId, serviceId, updateServiceInput) as Service;
        await Service.findByIdAndUpdate(serviceId, {
            name: convertToSave(name),
            suggestedRetailerPrice: convertToSave(suggestedRetailerPrice),
            basicProcedure: convertToSave(basicProcedure),
            accessories: convertToSave(accessories),
            unit: convertToSave(unit)
        });
        return await ModifiedService.service(serviceId, userId, oldService);
    }
}
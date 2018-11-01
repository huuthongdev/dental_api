import { Service, mustExist, ServiceError, modifiedSelect, ModifiedService } from "../../../src/refs";

export class RemoveService {
    static async validate(serviceId: string) {
        const oldService = await Service.findById(serviceId).select(modifiedSelect) as Service;
        mustExist(oldService, ServiceError.CANNOT_FIND_SERVICE);
        return oldService;
    }

    static async remove(serviceId: string) {
        await this.validate(serviceId);
        return await Service.findByIdAndRemove(serviceId);
    }

    static async disable(userId: string, serviceId: string) {
        const oldService = await this.validate(serviceId);
        await Service.findByIdAndUpdate(serviceId, { isActive: false }, { new: true });
        return await ModifiedService.service(serviceId, userId, oldService);
    }

    static async enable(userId: string, serviceId: string) {
        const oldService = await this.validate(serviceId);
        await Service.findByIdAndUpdate(serviceId, { isActive: true }, { new: true });
        return await ModifiedService.service(serviceId, userId, oldService);
    }
}
import { ServiceMeta, Service, mustBeObjectId, mustExist, ServiceError, Branch, BranchError, makeSure } from "../../../src/refs";

export class CreateServiceMeta {
    static errors = {
        PRICE_MUST_BE_PROVIDED: 'PRICE_MUST_BE_PROVIDED',
        SERVICE_META_IS_EXISTED_IN_CURRENT_BRANCH: 'SERVICE_META_IS_EXISTED_IN_CURRENT_BRANCH'
    } 

    static async validate(serviceId: string, price: number, branchId: string) {
        mustBeObjectId(serviceId, branchId);
        // Check exist
        mustExist(price, this.errors.PRICE_MUST_BE_PROVIDED);
        const checkService = await Service.findById(serviceId);
        mustExist(checkService, ServiceError.CANNOT_FIND_SERVICE);
        const checkBranch = await Branch.findById(branchId);
        mustExist(checkBranch, BranchError.CANNOT_FIND_BRANCH);
        const checkServiceMeta = await ServiceMeta.count({ branch: branchId });
        makeSure(checkServiceMeta === 0, this.errors.SERVICE_META_IS_EXISTED_IN_CURRENT_BRANCH);
    }
 
    static async create(serviceId: string, price: number, branchId: string) {
        await this.validate(serviceId, price, branchId);
        const serviceMeta = new ServiceMeta({ service: serviceId, price, branch: branchId });
        await serviceMeta.save();
        return await Service.findByIdAndUpdate(serviceId, { $addToSet: { serviceMetaes: serviceMeta._id } }, { new: true })
        .populate('serviceMetaes');
    }
}
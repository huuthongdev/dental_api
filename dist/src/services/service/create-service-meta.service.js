"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const refs_1 = require("../../../src/refs");
class CreateServiceMeta {
    static validate(serviceId, price, branchId) {
        return __awaiter(this, void 0, void 0, function* () {
            refs_1.mustBeObjectId(serviceId, branchId);
            // Check exist
            refs_1.mustExist(price, this.errors.PRICE_MUST_BE_PROVIDED);
            const checkService = yield refs_1.Service.findById(serviceId);
            refs_1.mustExist(checkService, refs_1.ServiceError.CANNOT_FIND_SERVICE);
            const checkBranch = yield refs_1.Branch.findById(branchId);
            refs_1.mustExist(checkBranch, refs_1.BranchError.CANNOT_FIND_BRANCH);
            const checkServiceMeta = yield refs_1.ServiceMeta.count({ branch: branchId });
            refs_1.makeSure(checkServiceMeta === 0, this.errors.SERVICE_META_IS_EXISTED_IN_CURRENT_BRANCH);
        });
    }
    static create(serviceId, price, branchId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.validate(serviceId, price, branchId);
            const serviceMeta = new refs_1.ServiceMeta({ service: serviceId, price, branch: branchId });
            yield serviceMeta.save();
            return yield refs_1.Service.findByIdAndUpdate(serviceId, { $addToSet: { serviceMetaes: serviceMeta._id } }, { new: true })
                .populate('serviceMetaes');
        });
    }
}
CreateServiceMeta.errors = {
    PRICE_MUST_BE_PROVIDED: 'PRICE_MUST_BE_PROVIDED',
    SERVICE_META_IS_EXISTED_IN_CURRENT_BRANCH: 'SERVICE_META_IS_EXISTED_IN_CURRENT_BRANCH'
};
exports.CreateServiceMeta = CreateServiceMeta;

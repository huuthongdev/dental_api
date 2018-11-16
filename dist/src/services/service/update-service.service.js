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
class UpdateService {
    static validate(userId, serviceId, name, suggestedRetailerPrice, basicProcedure, accessories, unit) {
        return __awaiter(this, void 0, void 0, function* () {
            refs_1.mustExist(userId, serviceId);
            refs_1.mustExist(suggestedRetailerPrice, refs_1.ServiceError.SUGGESTED_RETAILER_PRICE_MUST_BE_PROVIDED);
            refs_1.mustExist(name, refs_1.ServiceError.NAME_MUST_BE_PROVIDED);
            refs_1.mustExist(unit, refs_1.ServiceError.UNIT_MUST_BE_PROVIDED);
            const oldService = yield refs_1.Service.findById(serviceId);
            refs_1.mustExist(oldService, refs_1.ServiceError.CANNOT_FIND_SERVICE);
            const checkNameUnique = yield refs_1.Service.count({ name, _id: { $ne: serviceId } });
            refs_1.makeSure(checkNameUnique === 0, refs_1.ServiceError.NAME_IS_EXISTED);
            return oldService;
        });
    }
    static update(userId, serviceId, name, suggestedRetailerPrice, basicProcedure, accessories, unit, cost) {
        return __awaiter(this, void 0, void 0, function* () {
            const oldService = yield this.validate(userId, serviceId, name, suggestedRetailerPrice, basicProcedure, accessories, unit);
            yield refs_1.Service.findByIdAndUpdate(serviceId, { name, suggestedRetailerPrice, basicProcedure, accessories, unit, cost });
            return yield refs_1.ModifiedService.service(serviceId, userId, oldService);
        });
    }
}
exports.UpdateService = UpdateService;

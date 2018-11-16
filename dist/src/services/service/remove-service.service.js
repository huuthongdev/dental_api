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
class RemoveService {
    static validate(serviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            refs_1.mustBeObjectId(serviceId);
            const oldService = yield refs_1.Service.findById(serviceId).select(refs_1.modifiedSelect);
            refs_1.mustExist(oldService, refs_1.ServiceError.CANNOT_FIND_SERVICE);
            return oldService;
        });
    }
    static remove(serviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.validate(serviceId);
            return yield refs_1.Service.findByIdAndRemove(serviceId);
        });
    }
    static disable(userId, serviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const oldService = yield this.validate(serviceId);
            yield refs_1.Service.findByIdAndUpdate(serviceId, { isActive: false }, { new: true });
            return yield refs_1.ModifiedService.service(serviceId, userId, oldService);
        });
    }
    static enable(userId, serviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const oldService = yield this.validate(serviceId);
            yield refs_1.Service.findByIdAndUpdate(serviceId, { isActive: true }, { new: true });
            return yield refs_1.ModifiedService.service(serviceId, userId, oldService);
        });
    }
}
exports.RemoveService = RemoveService;

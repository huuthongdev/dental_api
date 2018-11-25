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
class CreateService {
    static validate(userId, createServiceInput) {
        return __awaiter(this, void 0, void 0, function* () {
            refs_1.mustBeObjectId(userId);
            const { name, suggestedRetailerPrice, basicProcedure, accessories, unit } = createServiceInput;
            refs_1.mustExist(suggestedRetailerPrice, refs_1.ServiceError.SUGGESTED_RETAILER_PRICE_MUST_BE_PROVIDED);
            refs_1.mustExist(name, refs_1.ServiceError.NAME_MUST_BE_PROVIDED);
            refs_1.mustExist(unit, refs_1.ServiceError.UNIT_MUST_BE_PROVIDED);
            const checkNameUnique = yield refs_1.Service.count({ name });
            refs_1.makeSure(checkNameUnique === 0, refs_1.ServiceError.NAME_IS_EXISTED);
        });
    }
    static create(userId, createServiceInput) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, suggestedRetailerPrice, basicProcedure, accessories, unit } = createServiceInput;
            yield this.validate(userId, createServiceInput);
            const sid = yield this.getSid();
            const service = new refs_1.Service({
                sid,
                name: refs_1.convertToSave(name),
                suggestedRetailerPrice: refs_1.convertToSave(suggestedRetailerPrice),
                basicProcedure: refs_1.convertToSave(basicProcedure),
                accessories: refs_1.convertToSave(accessories),
                createBy: userId,
                unit: refs_1.convertToSave(unit)
            });
            yield service.save();
            return yield this.getServiceInfo(service._id);
        });
    }
    static getSid() {
        return __awaiter(this, void 0, void 0, function* () {
            const maxSid = yield refs_1.Service.find({}).sort({ sid: -1 }).limit(1);
            if (maxSid.length === 0)
                return refs_1.SID_START_AT;
            return maxSid[0].sid + 1;
        });
    }
    static getServiceInfo(serviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield refs_1.Service.findById(serviceId).populate({
                path: 'accessories.product',
                select: 'name sid cost'
            }).exec();
        });
    }
}
exports.CreateService = CreateService;

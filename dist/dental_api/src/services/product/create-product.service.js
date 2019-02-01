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
const product_errors_1 = require("./product.errors");
class CreateProductService {
    static validate(userId, createProductInput) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, suggestedRetailerPrice, unit, origin, cost } = createProductInput;
            refs_1.mustBeObjectId(userId);
            refs_1.mustExist(name, product_errors_1.ProductError.NAME_MUST_BE_PROVIDED);
            refs_1.mustExist(unit, product_errors_1.ProductError.UNIT_MUST_BE_PROVIDED);
            refs_1.mustExist(suggestedRetailerPrice, product_errors_1.ProductError.SUGGESTED_RETAILER_PRICE_MUST_BE_PROVIDED);
            const checkUniqueName = yield refs_1.Product.count({ name });
            refs_1.makeSure(checkUniqueName === 0, product_errors_1.ProductError.NAME_IS_EXISTED);
        });
    }
    static create(userId, createProductInput) {
        return __awaiter(this, void 0, void 0, function* () {
            let { name, suggestedRetailerPrice, unit, origin, cost } = createProductInput;
            if (!cost)
                cost = 0;
            yield this.validate(userId, createProductInput);
            const sid = yield this.getSid();
            const product = new refs_1.Product({
                sid,
                name: refs_1.convertToSave(name),
                suggestedRetailerPrice: refs_1.convertToSave(suggestedRetailerPrice),
                origin: refs_1.convertToSave(origin),
                createBy: userId,
                unit: refs_1.convertToSave(unit),
                cost: refs_1.convertToSave(cost)
            });
            return yield product.save();
        });
    }
    static getSid() {
        return __awaiter(this, void 0, void 0, function* () {
            const maxSid = yield refs_1.Product.find({}).sort({ sid: -1 }).limit(1);
            if (maxSid.length === 0)
                return refs_1.SID_START_AT;
            return maxSid[0].sid + 1;
        });
    }
}
exports.CreateProductService = CreateProductService;

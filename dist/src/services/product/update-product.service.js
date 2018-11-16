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
class UpdateProductService {
    static validate(productId, userId, name, suggestedRetailerPrice, origin, unit, cost) {
        return __awaiter(this, void 0, void 0, function* () {
            refs_1.mustBeObjectId(productId, userId);
            refs_1.mustExist(name, refs_1.ProductError.NAME_MUST_BE_PROVIDED);
            refs_1.mustExist(unit, refs_1.ProductError.UNIT_MUST_BE_PROVIDED);
            refs_1.mustExist(suggestedRetailerPrice, refs_1.ProductError.SUGGESTED_RETAILER_PRICE_MUST_BE_PROVIDED);
            const oldProduct = yield refs_1.Product.findById(productId).select(refs_1.modifiedSelect);
            refs_1.mustExist(oldProduct, refs_1.ProductError.CANNOT_FIND_PRODUCT);
            const checkUniqueName = yield refs_1.Product.count({ name, _id: { $ne: productId } });
            refs_1.makeSure(checkUniqueName === 0, refs_1.ProductError.NAME_IS_EXISTED);
            return oldProduct;
        });
    }
    static update(productId, userId, name, suggestedRetailerPrice, origin, unit, cost) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!cost)
                cost = 0;
            const oldProduct = yield this.validate(productId, userId, name, suggestedRetailerPrice, origin, unit, cost);
            yield refs_1.Product.findByIdAndUpdate(productId, { name, suggestedRetailerPrice, origin, cost, unit }, { new: true });
            return yield refs_1.ModifiedService.product(productId, userId, oldProduct);
        });
    }
}
exports.UpdateProductService = UpdateProductService;

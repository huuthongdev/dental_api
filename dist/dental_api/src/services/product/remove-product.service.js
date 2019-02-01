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
class RemoveProductService {
    static validate(productId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            refs_1.mustBeObjectId(productId);
            if (userId)
                refs_1.mustBeObjectId(userId);
            const oldProduct = yield refs_1.Product.findById(productId).select(refs_1.modifiedSelect);
            refs_1.mustExist(oldProduct, refs_1.ProductError.CANNOT_FIND_PRODUCT);
            return oldProduct;
        });
    }
    static remove(productId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.validate(productId);
            return yield refs_1.Product.findByIdAndRemove(productId);
        });
    }
    static disable(productId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const oldProduct = yield this.validate(productId, userId);
            yield refs_1.Product.findByIdAndUpdate(productId, { isActive: false }, { new: true });
            return refs_1.ModifiedService.product(productId, userId, oldProduct);
        });
    }
    static enable(productId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const oldProduct = yield this.validate(productId, userId);
            yield refs_1.Product.findByIdAndUpdate(productId, { isActive: true }, { new: true });
            return refs_1.ModifiedService.product(productId, userId, oldProduct);
        });
    }
}
exports.RemoveProductService = RemoveProductService;

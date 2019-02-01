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
class RemoveClientService {
    static validate(clientId) {
        return __awaiter(this, void 0, void 0, function* () {
            refs_1.mustBeObjectId(clientId);
            const oldClient = yield refs_1.Client.findById(clientId).select(refs_1.modifiedSelect);
            refs_1.mustExist(oldClient, refs_1.ClientError.CANNOT_FIND_CLIENT);
            return oldClient;
        });
    }
    static remove(clientId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.validate(clientId);
            return yield refs_1.Client.findByIdAndRemove(clientId);
        });
    }
    static disable(userId, clientId) {
        return __awaiter(this, void 0, void 0, function* () {
            const oldClient = yield this.validate(clientId);
            yield refs_1.Client.findByIdAndUpdate(clientId, { isActive: false }, { new: true });
            return yield refs_1.ModifiedService.client(clientId, userId, oldClient);
        });
    }
    static enable(userId, clientId) {
        return __awaiter(this, void 0, void 0, function* () {
            const oldClient = yield this.validate(clientId);
            yield refs_1.Client.findByIdAndUpdate(clientId, { isActive: true }, { new: true });
            return yield refs_1.ModifiedService.client(clientId, userId, oldClient);
        });
    }
}
exports.RemoveClientService = RemoveClientService;

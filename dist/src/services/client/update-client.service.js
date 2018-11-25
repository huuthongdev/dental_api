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
class UpdateClientService {
    static validate(clientId, userId, updateClientInput) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, email, phone, birthday, medicalHistory, gender, city, district, address, homeTown } = updateClientInput;
            refs_1.mustBeObjectId(userId, clientId);
            // Must Exist
            refs_1.mustExist(name, refs_1.ClientError.NAME_MUST_BE_PROVIDED);
            refs_1.mustExist(phone, refs_1.ClientError.PHONE_MUST_BE_PROVIDED);
            const oldClient = yield refs_1.Client.findById(clientId).select(refs_1.modifiedSelect);
            refs_1.mustExist(oldClient, refs_1.ClientError.CANNOT_FIND_CLIENT);
            // Validate Email
            if (email)
                refs_1.makeSure(refs_1.validateEmail(email), refs_1.ClientError.EMAIL_INCORRECT);
            // Must Unique
            const checkEmail = yield refs_1.Client.count({ email, _id: { $ne: clientId } });
            refs_1.makeSure(checkEmail === 0, refs_1.ClientError.EMAIL_IS_EXISTED);
            const checkPhone = yield refs_1.Client.count({ phone, _id: { $ne: clientId } });
            refs_1.makeSure(checkPhone === 0, refs_1.ClientError.PHONE_IS_EXISTED);
            return oldClient;
        });
    }
    static update(clientId, userId, updateClientInput) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, email, phone, birthday, medicalHistory, gender, city, district, address, homeTown } = updateClientInput;
            const oldClient = yield this.validate(clientId, userId, updateClientInput);
            yield refs_1.Client.findByIdAndUpdate(clientId, { name, phone, email, birthday, medicalHistory, city, district, address, homeTown }, { new: true });
            return yield refs_1.ModifiedService.client(clientId, userId, oldClient);
        });
    }
}
exports.UpdateClientService = UpdateClientService;

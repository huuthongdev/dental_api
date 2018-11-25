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
class CreateClientService {
    static validate(userId, createClientInput) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, email, phone } = createClientInput;
            refs_1.mustBeObjectId(userId);
            // Must Exist
            refs_1.mustExist(name, refs_1.ClientError.NAME_MUST_BE_PROVIDED);
            refs_1.mustExist(phone, refs_1.ClientError.PHONE_MUST_BE_PROVIDED);
            // Validate Email
            if (email)
                refs_1.makeSure(refs_1.validateEmail(email), refs_1.ClientError.EMAIL_INCORRECT);
            // Must Unique
            const checkEmail = yield refs_1.Client.count({ email });
            refs_1.makeSure(checkEmail === 0, refs_1.ClientError.EMAIL_IS_EXISTED);
            const checkPhone = yield refs_1.Client.count({ phone });
            refs_1.makeSure(checkPhone === 0, refs_1.ClientError.PHONE_IS_EXISTED);
        });
    }
    static create(userId, createClientInput) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.validate(userId, createClientInput);
            const { name, email, phone, birthday, medicalHistory, city, district, address, homeTown, gender } = createClientInput;
            const sid = yield this.getSid();
            const client = new refs_1.Client({ sid, createBy: userId, name, phone, email, birthday, medicalHistory, city, district, address, homeTown, gender });
            return yield client.save();
        });
    }
    static getSid() {
        return __awaiter(this, void 0, void 0, function* () {
            const maxSid = yield refs_1.Client.find({}).sort({ sid: -1 }).limit(1);
            if (maxSid.length === 0)
                return refs_1.SID_START_AT;
            return maxSid[0].sid + 1;
        });
    }
}
exports.CreateClientService = CreateClientService;

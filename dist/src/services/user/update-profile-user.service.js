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
class UpdateProfileUserService {
    static validate(userId, userUpdateId, updateProfileUserInput) {
        return __awaiter(this, void 0, void 0, function* () {
            refs_1.mustBeObjectId(userId, userUpdateId);
            const { name, email, phone } = updateProfileUserInput;
            // Find old data 
            const oldData = yield refs_1.User.findById(userUpdateId).select(refs_1.modifiedSelect);
            refs_1.mustExist(oldData, refs_1.UserError.CANNOT_FIND_USER);
            // Check Exist
            refs_1.mustExist(name, refs_1.UserError.NAME_MUST_BE_PROVIDED);
            refs_1.mustExist(email, refs_1.UserError.EMAIL_MUST_BE_PROVIDED);
            refs_1.mustExist(phone, refs_1.UserError.PHONE_MUST_BE_PROVIDED);
            // Validate
            refs_1.makeSure(refs_1.validateEmail(email), refs_1.UserError.EMAIL_INCORRECT);
            // Check Unique
            const emailCount = yield refs_1.User.count({ email, _id: { $ne: userUpdateId } });
            refs_1.makeSure(emailCount === 0, refs_1.UserError.EMAIL_IS_EXISTED);
            const phoneCount = yield refs_1.User.count({ phone, _id: { $ne: userUpdateId } });
            refs_1.makeSure(phoneCount === 0, refs_1.UserError.PHONE_IS_EXISTED);
            return oldData;
        });
    }
    static update(userId, userUpdateId, updateProfileUserInput) {
        return __awaiter(this, void 0, void 0, function* () {
            const oldData = yield this.validate(userId, userUpdateId, updateProfileUserInput);
            let { name, email, phone, city, district, address, homeTown, birthday } = updateProfileUserInput;
            city = refs_1.convertToSave(city);
            district = refs_1.convertToSave(district);
            address = refs_1.convertToSave(address);
            homeTown = refs_1.convertToSave(homeTown);
            birthday = refs_1.convertToSave(birthday);
            yield refs_1.User.findByIdAndUpdate(userUpdateId, { name, email, phone, city, district, address, birthday, homeTown }, { new: true });
            yield refs_1.ModifiedService.user(userUpdateId, userId, oldData);
            return yield refs_1.GetUserInfo.get(userId);
        });
    }
}
exports.UpdateProfileUserService = UpdateProfileUserService;

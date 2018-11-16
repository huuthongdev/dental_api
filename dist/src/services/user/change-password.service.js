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
const bcryptjs_1 = require("bcryptjs");
const refs_1 = require("../../../src/refs");
class ChangePasswordService {
    static validate(userId, oldPassword, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            // Must Exist
            refs_1.mustExist(oldPassword, refs_1.UserError.OLD_PASSWORD_MUST_BE_PROVIDED);
            refs_1.mustExist(newPassword, refs_1.UserError.NEW_PASSWORD_MUST_BE_PROVIDED);
            // Make Sure
            const user = yield refs_1.User.findById(userId);
            const isMatch = yield bcryptjs_1.compare(oldPassword, user.password);
            refs_1.makeSure(isMatch, refs_1.UserError.OLD_PASSWORD_INCORRECT);
            return user;
        });
    }
    static change(userId, oldPassword, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            const userOld = yield this.validate(userId, oldPassword, newPassword);
            const passwordVersion = userOld.passwordVersion + 1;
            const hashed = yield bcryptjs_1.hash(newPassword, 8);
            const user = yield refs_1.User.findByIdAndUpdate(userId, { password: hashed, passwordVersion }, { new: true });
            yield refs_1.ModifiedService.user(userId, userId, userOld);
            return yield refs_1.GetUserInfo.get(user._id);
        });
    }
}
exports.ChangePasswordService = ChangePasswordService;

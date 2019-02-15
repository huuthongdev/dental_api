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
const refs_1 = require("../../../../src/refs");
const bcryptjs_1 = require("bcryptjs");
class ForgotPasswordService {
    static suggest(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const checkUser = yield refs_1.User.findOne({ email });
                refs_1.mustExist(checkUser, refs_1.UserError.CANNOT_FIND_USER);
                let changePasswordPIN = Math.ceil((Math.random()) * 1000000);
                if (changePasswordPIN.toString().length === 5)
                    changePasswordPIN = changePasswordPIN * 10;
                yield refs_1.User.findByIdAndUpdate(checkUser._id, { changePasswordPIN }, { new: true });
                refs_1.MailService.send(checkUser.email, 'Mã PIN thay đổi mật khẩu', `<h1>${changePasswordPIN}</h1>`);
                setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                    yield refs_1.User.findByIdAndUpdate(checkUser._id, { changePasswordPIN: null });
                }), 1000 * 60 * 10);
                return true;
            }
            catch (error) {
                throw new refs_1.ServerError(error.message, 400);
            }
        });
    }
    static changePasswordWithPIN(pin, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            refs_1.mustExist(pin, 'Mã PIN cần được cung cấp');
            const checkUser = yield refs_1.User.findOne({ changePasswordPIN: +pin });
            refs_1.mustExist(checkUser, 'Mã PIN không hợp lệ!');
            const hashed = yield bcryptjs_1.hash(newPassword, 8);
            return yield refs_1.User.findByIdAndUpdate(checkUser._id, { password: hashed, passwordVersion: checkUser.passwordVersion + 1 }, { new: true });
        });
    }
    static validatePIN(pin) {
        return __awaiter(this, void 0, void 0, function* () {
            refs_1.mustExist(pin, 'Mã PIN cần được cung cấp');
            const checkUser = yield refs_1.User.findOne({ changePasswordPIN: +pin });
            refs_1.mustExist(checkUser, 'Mã PIN không hợp lệ!');
            return true;
        });
    }
}
exports.ForgotPasswordService = ForgotPasswordService;

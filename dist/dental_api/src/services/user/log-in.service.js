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
const refs_1 = require("../../refs");
const bcryptjs_1 = require("bcryptjs");
class LoginService {
    static login(loginInfo, password) {
        return __awaiter(this, void 0, void 0, function* () {
            refs_1.mustExist(loginInfo, refs_1.UserError.LOGIN_INFO_BE_PROVIDED);
            refs_1.mustExist(password, refs_1.UserError.INVALID_LOG_IN_INFO);
            const checkEmail = refs_1.validateEmail(loginInfo);
            if (checkEmail)
                return yield this.loginWithEmail(loginInfo, password);
            return yield this.loginWithPhone(loginInfo, password);
        });
    }
    static loginWithPhone(phone, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield refs_1.User.findOne({ phone });
            refs_1.mustExist(user, refs_1.UserError.INVALID_LOG_IN_INFO);
            const isMatch = yield bcryptjs_1.compare(password, user.password);
            refs_1.makeSure(isMatch, refs_1.UserError.INVALID_LOG_IN_INFO);
            return refs_1.GetUserInfo.get(user._id, true);
        });
    }
    static loginWithEmail(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield refs_1.User.findOne({ email });
            refs_1.mustExist(user, refs_1.UserError.INVALID_LOG_IN_INFO);
            const isMatch = yield bcryptjs_1.compare(password, user.password);
            refs_1.makeSure(isMatch, refs_1.UserError.INVALID_LOG_IN_INFO);
            return refs_1.GetUserInfo.get(user._id, true);
        });
    }
}
exports.LoginService = LoginService;

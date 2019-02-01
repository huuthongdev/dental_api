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
class CheckTokenUserService {
    static check(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const obj = yield refs_1.verifyLogInToken(token);
            const { _id, version } = obj;
            const user = yield refs_1.User.findOne({ _id, passwordVersion: version });
            refs_1.mustExist(user, refs_1.UserError.USER_INFO_EXPIRED);
            return yield refs_1.GetUserInfo.get(user._id, true);
        });
    }
}
exports.CheckTokenUserService = CheckTokenUserService;

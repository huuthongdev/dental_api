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
class GetUserInfo {
    static get(userId, getToken = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield refs_1.User.findById(userId).select({ password: false })
                .populate({
                path: 'roleInBranchs',
                select: { user: false },
                populate: {
                    path: 'branch',
                    select: 'sid name isMaster'
                }
            });
            let userInfo = user.toObject();
            delete userInfo.passwordVersion;
            if (!getToken)
                return userInfo;
            // Get Token
            const token = yield refs_1.createToken({ _id: user._id, version: user.passwordVersion });
            userInfo.token = token;
            return userInfo;
        });
    }
}
exports.GetUserInfo = GetUserInfo;

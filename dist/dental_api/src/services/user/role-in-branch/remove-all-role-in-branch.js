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
class RemoveAllRoleInBranchService {
    static validate(userId, branchId) {
        return __awaiter(this, void 0, void 0, function* () {
            refs_1.mustBeObjectId(userId, branchId);
            const user = yield refs_1.User.findById(userId);
            refs_1.mustExist(user, refs_1.UserError.CANNOT_FIND_USER);
            const branch = yield refs_1.Branch.findById(branchId);
            refs_1.mustExist(branch, refs_1.BranchError.CANNOT_FIND_BRANCH);
        });
    }
    static remove(userId, branchId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.validate(userId, branchId);
            return yield refs_1.RoleInBranch.findOneAndRemove({ branch: branchId });
        });
    }
}
exports.RemoveAllRoleInBranchService = RemoveAllRoleInBranchService;

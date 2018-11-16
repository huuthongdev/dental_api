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
class CheckRoleInBranchService {
    static check(userId, branchId, roleRequired) {
        return __awaiter(this, void 0, void 0, function* () {
            // Check chairmain
            const checkChairmain = yield refs_1.RoleInBranch.findOne({ user: userId, roles: { $eq: refs_1.Role.ADMIN } });
            if (checkChairmain)
                return true;
            // Check Roles
            const userRolesInCurrentBranch = yield refs_1.RoleInBranch.findOne({ branch: branchId, user: userId });
            if (!userRolesInCurrentBranch)
                return false;
            for (let i = 0; i < userRolesInCurrentBranch.roles.length; i++) {
                if (roleRequired.includes(userRolesInCurrentBranch.roles[i]))
                    return true;
            }
            return false;
        });
    }
}
exports.CheckRoleInBranchService = CheckRoleInBranchService;

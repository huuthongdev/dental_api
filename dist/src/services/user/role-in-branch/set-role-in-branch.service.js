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
class SetRoleInBranchService {
    static validate(userId, branchId, roles) {
        return __awaiter(this, void 0, void 0, function* () {
            refs_1.mustBeObjectId(userId, branchId);
            const user = yield refs_1.User.findById(userId);
            refs_1.mustExist(user, refs_1.UserError.CANNOT_FIND_USER);
            const branch = yield refs_1.Branch.findById(branchId);
            refs_1.mustExist(branch, refs_1.BranchError.CANNOT_FIND_BRANCH);
            const roleInBranch = yield refs_1.RoleInBranch.findOne({ branch: branchId, user: userId });
            // Check valid roles
            for (let i = 0; i < roles.length; i++) {
                const { ACCOUNTANT, ACCOUNTING_MANAGER, ADMIN, DIRECTOR, CUSTOMER_CARE, CUSTOMER_CARE_MANAGER, X_RAY, DENTISTS_MANAGER, DENTIST } = refs_1.Role;
                const rolesArr = [ACCOUNTANT, ACCOUNTING_MANAGER, ADMIN, DIRECTOR, CUSTOMER_CARE, CUSTOMER_CARE_MANAGER, X_RAY, DENTISTS_MANAGER, DENTIST];
                refs_1.makeSure(rolesArr.includes(roles[i]), refs_1.RoleInBranchError.INVALID_ROLE);
            }
            return roleInBranch;
        });
    }
    static set(userId, branchId, roles) {
        return __awaiter(this, void 0, void 0, function* () {
            const roleInBranch = yield this.validate(userId, branchId, roles);
            if (roleInBranch)
                return yield this.updateRoleInCurrentBranch(roleInBranch._id, roles, userId);
            return yield this.addNewRoleInBranch(branchId, roles, userId);
        });
    }
    static updateRoleInCurrentBranch(roleInBranchId, roles, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield refs_1.RoleInBranch.findByIdAndUpdate(roleInBranchId, { roles }, { new: true });
            return yield refs_1.GetUserInfo.get(userId);
        });
    }
    static addNewRoleInBranch(branchId, roles, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const newRoleInBranch = new refs_1.RoleInBranch({
                user: userId,
                branch: branchId,
                roles
            });
            yield newRoleInBranch.save();
            yield refs_1.User.findByIdAndUpdate(userId, { $addToSet: { roleInBranchs: newRoleInBranch._id } }, { new: true });
            return yield refs_1.GetUserInfo.get(userId);
        });
    }
}
exports.SetRoleInBranchService = SetRoleInBranchService;

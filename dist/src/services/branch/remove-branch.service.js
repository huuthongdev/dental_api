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
class RemoveBranchService {
    static validate(userId, branchId, remove = false) {
        return __awaiter(this, void 0, void 0, function* () {
            refs_1.mustBeObjectId(userId, branchId);
            const oldBranch = yield refs_1.Branch.findById(branchId).select({ modifieds: false, __v: false, createAt: false, createBy: false });
            refs_1.mustExist(oldBranch, refs_1.BranchError.CANNOT_FIND_BRANCH);
            if (remove)
                refs_1.makeSure(oldBranch.isMaster === false, refs_1.BranchError.CANNOT_REMOVE_MASTER_BRANCH);
            return oldBranch;
        });
    }
    static disable(userId, branchId) {
        return __awaiter(this, void 0, void 0, function* () {
            const oldBranch = yield this.validate(userId, branchId);
            const newBranch = yield refs_1.Branch.findByIdAndUpdate(branchId, { isActive: false }, { new: true });
            refs_1.ModifiedService.branch(branchId, userId, oldBranch);
            return newBranch;
        });
    }
    static enable(userId, branchId) {
        return __awaiter(this, void 0, void 0, function* () {
            const oldBranch = yield this.validate(userId, branchId);
            const newBranch = yield refs_1.Branch.findByIdAndUpdate(branchId, { isActive: true }, { new: true });
            refs_1.ModifiedService.branch(branchId, userId, oldBranch);
            return newBranch;
        });
    }
    static remove(userId, branchId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.validate(userId, branchId, true);
            // Remove All Roles In Branchs Related
            const branch = yield refs_1.Branch.findByIdAndRemove(branchId);
            yield refs_1.RoleInBranch.remove({ branch: branchId });
            yield this.removeDataRelated(branchId);
            return branch;
        });
    }
    static removeDataRelated(branchId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Remove all User RoleInBranchs related
            const roleInBranchs = yield refs_1.RoleInBranch.find({ branch: branchId });
            for (let i = 0; i < roleInBranchs.length; i++) {
                const user = yield refs_1.User.findById(roleInBranchs[i].user);
                yield refs_1.User.findByIdAndUpdate(user._id, { $pull: { roleInBranchs: roleInBranchs[i]._id } }, { new: true });
            }
        });
    }
}
exports.RemoveBranchService = RemoveBranchService;

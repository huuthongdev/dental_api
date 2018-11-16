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
class UpdateBranchService {
    static validate(userId, branchId, name, email, phone, city, district, address) {
        return __awaiter(this, void 0, void 0, function* () {
            refs_1.mustBeObjectId(userId, branchId);
            // Must Exist
            refs_1.mustExist(name, refs_1.BranchError.NAME_MUST_BE_PROVIDED);
            const oldBranch = yield refs_1.Branch.findById(branchId).select(refs_1.modifiedSelect);
            refs_1.mustExist(oldBranch, refs_1.BranchError.CANNOT_FIND_BRANCH);
            // Make Sure
            const checkUniqueName = yield refs_1.Branch.count({ name, _id: { $ne: branchId } });
            refs_1.makeSure(checkUniqueName === 0, refs_1.BranchError.NAME_IS_EXISTED);
            email = email ? email : undefined;
            if (email) {
                refs_1.makeSure(refs_1.validateEmail(email), refs_1.BranchError.EMAIL_INCORRECT);
                const checkUniqueEmail = yield refs_1.Branch.count({ email, _id: { $ne: branchId } });
                refs_1.makeSure(checkUniqueEmail === 0, refs_1.BranchError.EMAIL_IS_EXISTED);
            }
            phone = phone ? phone : undefined;
            if (phone) {
                const checkUniquePhone = yield refs_1.Branch.count({ phone, _id: { $ne: branchId } });
                refs_1.makeSure(checkUniquePhone === 0, refs_1.BranchError.PHONE_IS_EXISTED);
            }
            return oldBranch;
        });
    }
    static update(userId, branchId, name, email, phone, city, district, address) {
        return __awaiter(this, void 0, void 0, function* () {
            const oldBranch = yield this.validate(userId, branchId, name, email, phone, city, district, address);
            yield refs_1.Branch.findByIdAndUpdate(branchId, { name, email, phone, city, district, address }, { new: true });
            return yield refs_1.ModifiedService.branch(branchId, userId, oldBranch);
        });
    }
}
exports.UpdateBranchService = UpdateBranchService;

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
function mustBeUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // User
            const { _id, version } = yield refs_1.verifyLogInToken(req.headers.token);
            const user = yield refs_1.User.findById(_id).populate('roleInBranchs', 'branch roles');
            refs_1.mustExist(user, refs_1.UserError.CANNOT_FIND_USER);
            refs_1.makeSure(+version === +user.passwordVersion, refs_1.UserError.INVALID_USER_INFO, 404);
            req.query.userId = _id;
            // Branch
            const branchId = req.headers.branch;
            refs_1.mustExist(branchId, refs_1.BranchError.BRANCH_ID_MUST_BE_PROVIDED);
            const branch = yield refs_1.Branch.findById(branchId);
            refs_1.mustExist(branch, refs_1.BranchError.CANNOT_FIND_BRANCH);
            refs_1.makeSure(branch.isActive, refs_1.BranchError.BRANCH_IS_DISABLED);
            req.query.branchId = branchId;
            // Role in branch
            let branchRoles = user.toObject().roleInBranchs.find((v) => v.branch.toString() === branchId.toString());
            req.query.roles = branchRoles.roles;
            // Next
            next();
        }
        catch (error) {
            res.onError(error);
        }
    });
}
exports.mustBeUser = mustBeUser;

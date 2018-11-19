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
function mustHaveRole(roles) {
    return function (req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            roles = roles ? roles : [];
            const userId = req.query.userId;
            const branchId = req.query.branchId;
            const check = yield refs_1.CheckRoleInBranchService.check(userId, branchId, roles);
            if (check)
                return next();
            return res.status(400).send({ success: false, message: refs_1.RoleInBranchError.INVALID_ROLE });
        });
    };
}
exports.mustHaveRole = mustHaveRole;

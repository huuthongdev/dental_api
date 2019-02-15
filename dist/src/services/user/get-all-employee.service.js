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
class GetAllEmployeesService {
    static getAll(userId, branchId, userRoles) {
        return __awaiter(this, void 0, void 0, function* () {
            const checkMaster = yield refs_1.CheckMasterBranchService.check(branchId);
            // const checkUserDirector = await CheckRoleInBranchService.check(userId, branchId, [Role.DIRECTOR]);
            if (checkMaster) {
                const users = yield refs_1.User.find({}).populate({
                    path: 'roleInBranchs',
                    select: { user: false },
                    populate: {
                        path: 'branch',
                        select: 'sid name isMaster'
                    }
                });
                return users;
            }
            let roleInBranchs = yield refs_1.RoleInBranch.find({ branch: branchId }).populate('user').populate('branch', 'name sid');
            const users = roleInBranchs.map((v) => v = Object.assign({}, v.toObject().user, { roleInBranchs: [{ roles: v.toObject().roles, branch: v.toObject().branch }] }));
            return users;
        });
    }
    static getEmployeeInOneBranch(branchId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield refs_1.RoleInBranch.find({ branch: branchId }).populate('user');
        });
    }
    static getFullForCreateEmployee() {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield refs_1.User.find({}).populate({
                path: 'roleInBranchs',
                select: { user: false },
                populate: {
                    path: 'branch',
                    select: 'sid name isMaster'
                }
            });
            return users;
        });
    }
}
exports.GetAllEmployeesService = GetAllEmployeesService;

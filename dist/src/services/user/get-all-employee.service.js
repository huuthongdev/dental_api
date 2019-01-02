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
    static getAll(userId, branchId) {
        return __awaiter(this, void 0, void 0, function* () {
            let roleInBranchs = yield refs_1.RoleInBranch.find({ user: userId, branch: branchId });
            roleInBranchs = roleInBranchs.map(v => v._id);
            let users = yield refs_1.User.find({}).select({ password: false }).sort({ createAt: -1 });
            users = users.map(v => v = v.toObject());
            for (let i = 0; i < users.length; i++) {
                let roleInBranchs = yield refs_1.RoleInBranch.find({ user: users[i]._id }).populate({ path: 'branch', select: 'sid name isMaster' });
                users[i].roleInBranchs = roleInBranchs;
            }
            return users;
        });
    }
    static getEmployeeInOneBranch(branchId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield refs_1.RoleInBranch.find({ branch: branchId }).populate('user');
        });
    }
}
exports.GetAllEmployeesService = GetAllEmployeesService;

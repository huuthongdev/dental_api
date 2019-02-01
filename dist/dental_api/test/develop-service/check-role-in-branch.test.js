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
const assert_1 = require("assert");
const init_database_for_test_1 = require("../../test/init-database-for-test");
const refs_1 = require("../../src/refs");
describe('Check Role In Branch', () => {
    let userCheckId, normalBranchId, masterBranchId;
    beforeEach('Prepare data for test', () => __awaiter(this, void 0, void 0, function* () {
        const dataInitial = yield init_database_for_test_1.InititalDatabaseForTest.testCheckRoleInBranch();
        userCheckId = dataInitial.checkUser._id.toString();
        normalBranchId = dataInitial.normalBranch._id.toString();
        masterBranchId = dataInitial.branchMaster._id.toString();
    }));
    it('Check normal roles', () => __awaiter(this, void 0, void 0, function* () {
        yield refs_1.SetRoleInBranchService.set(userCheckId, normalBranchId, [refs_1.Role.DENTIST, refs_1.Role.CUSTOMER_CARE]);
        const check = yield refs_1.CheckRoleInBranchService.check(userCheckId, normalBranchId, [refs_1.Role.DENTIST, refs_1.Role.X_RAY]);
        assert_1.equal(check, true);
    }));
    it('Check role admin', () => __awaiter(this, void 0, void 0, function* () {
        yield refs_1.SetRoleInBranchService.set(userCheckId, normalBranchId, [refs_1.Role.ADMIN]);
        const check = yield refs_1.CheckRoleInBranchService.check(userCheckId, normalBranchId, [refs_1.Role.DENTIST]);
        assert_1.equal(check, true);
    }));
    it('Check role different branch', () => __awaiter(this, void 0, void 0, function* () {
        yield refs_1.SetRoleInBranchService.set(userCheckId, normalBranchId, [refs_1.Role.CUSTOMER_CARE, refs_1.Role.DENTIST]);
        const check = yield refs_1.CheckRoleInBranchService.check(userCheckId, masterBranchId, [refs_1.Role.DENTIST]);
        assert_1.equal(check, false);
    }));
});

import { deepEqual, equal } from 'assert';
import { InititalDatabaseForTest } from '../../test/init-database-for-test';
import { CheckRoleInBranchService, Role, SetRoleInBranchService } from '../../src/refs';

describe('Check Role In Branch', () => {
    let userCheckId: string, normalBranchId: string, masterBranchId: string;
    beforeEach('Prepare data for test', async () => {
        const dataInitial = await InititalDatabaseForTest.testCheckRoleInBranch();
        userCheckId = dataInitial.checkUser._id.toString();
        normalBranchId = dataInitial.normalBranch._id.toString();
        masterBranchId = dataInitial.branchMaster._id.toString();
    }); 

    it('Check normal roles', async () => {
        await SetRoleInBranchService.set(userCheckId, normalBranchId, [Role.DENTIST, Role.CUSTOMER_CARE]);
        const check = await CheckRoleInBranchService.check(userCheckId, normalBranchId, [Role.DENTIST, Role.X_RAY]);
        equal(check, true);
    });

    it('Check role admin', async () => {
        await SetRoleInBranchService.set(userCheckId, normalBranchId, [Role.ADMIN]);
        const check = await CheckRoleInBranchService.check(userCheckId, normalBranchId, [Role.DENTIST]);
        equal(check, true);
    });

    it('Check role different branch', async () => {
        await SetRoleInBranchService.set(userCheckId, normalBranchId, [Role.CUSTOMER_CARE, Role.DENTIST]);
        const check = await CheckRoleInBranchService.check(userCheckId, masterBranchId, [Role.DENTIST]);
        equal(check, false);
    });
});
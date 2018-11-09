import request from 'supertest';
import { deepEqual, equal } from 'assert';
import { InititalDatabaseForTest } from '../../../test/init-database-for-test';
import { app, Role, ROOT_NAME, ROOT_EMAIL, ROOT_PHONE, Branch, BranchError, User, UserError, RoleInBranchError, SID_START_AT } from '../../../src/refs';

describe('POST /user/set-role-in-branch/:branchId', () => {
    let userId: string, branchId: string, token: string, branchName: string, normalBranchId: string, normalBranchName: string;
    beforeEach('Prepare data for test', async () => {
        const dataInitial = await InititalDatabaseForTest.createNormalBranch();
        userId = dataInitial.rootUser._id.toString();
        token = dataInitial.rootUser.token.toString();
        branchId = dataInitial.branchMaster._id.toString();
        branchName = dataInitial.branchMaster.name;
        normalBranchId = dataInitial.normalBranch._id.toString();
        normalBranchName = dataInitial.normalBranch.name.toString();
    });

    it('Can set role in current branch for user', async () => {
        const dataSend = {
            userId,
            branchId,
            roles: [Role.CHAIRMAN, Role.ACCOUNTANT, Role.CUSTOMER_CARE_MANAGER]
        }
        const response = await request(app)
            .put('/user/set-role-in-branch').set({ token, branch: branchId }).send(dataSend);
        const { success, result } = response.body;
        equal(success, true);
        equal(response.status, 200);
        const resExpected: any = {
            _id: userId,
            sid: SID_START_AT,
            name: ROOT_NAME,
            email: ROOT_EMAIL,
            phone: ROOT_PHONE,
            __v: 0,
            modifieds: [],
            createAt: result.createAt,
            roleInBranchs: result.roleInBranchs,
            isActive: true,
        }
        deepEqual(result, resExpected);
    });

    it('Can set role in deferent branch', async () => {
        const dataSend = {
            userId,
            branchId: normalBranchId,
            roles: [Role.ACCOUNTANT, Role.CUSTOMER_CARE_MANAGER]
        }
        const response = await request(app)
            .put('/user/set-role-in-branch').set({ token, branch: branchId }).send(dataSend);
        const { success, result } = response.body;
        equal(success, true);
        equal(response.status, 200);
        const resExpected: any = {
            _id: userId,
            sid: SID_START_AT,
            name: ROOT_NAME,
            email: ROOT_EMAIL,
            phone: ROOT_PHONE,
            __v: 0,
            modifieds: [],
            createAt: result.createAt,
            roleInBranchs: result.roleInBranchs,
            isActive: true,
        }
        deepEqual(result, resExpected);
    });

    it('Cannot set role in branch with removed branch', async () => {
        await Branch.findByIdAndRemove(normalBranchId);
        const dataSend1 = {
            userId,
            branchId: normalBranchId,
            roles: [Role.ACCOUNTANT, Role.CUSTOMER_CARE_MANAGER]
        };
        const response = await request(app)
            .put('/user/set-role-in-branch').set({ token, branch: branchId }).send(dataSend1);
        equal(response.body.success, false);
        equal(response.status, 400);
        equal(response.body.message, BranchError.CANNOT_FIND_BRANCH);
    });

    it('Cannot set role in branch with removed user', async () => {
        await User.findByIdAndRemove(userId);
        const dataSend1 = {
            userId,
            branchId: normalBranchId,
            roles: [Role.ACCOUNTANT, Role.CUSTOMER_CARE_MANAGER]
        };
        const response = await request(app)
            .put('/user/set-role-in-branch').set({ token, branch: branchId }).send(dataSend1);
        equal(response.body.success, false);
        equal(response.status, 404);
        equal(response.body.message, UserError.CANNOT_FIND_USER);
    });

    it('Cannot set role with invalid role', async () => {
        const dataSend1 = {
            userId,
            branchId: normalBranchId,
            roles: ['ROLE_INVALID']
        };
        const response = await request(app)
            .put('/user/set-role-in-branch').set({ token, branch: branchId }).send(dataSend1);
        equal(response.body.success, false);
        equal(response.status, 400);
        equal(response.body.message, RoleInBranchError.INVALID_ROLE);
    });
});
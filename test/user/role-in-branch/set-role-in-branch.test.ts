import request from 'supertest';
import { deepEqual, equal } from 'assert';
import { InitDatabaseForTest } from '../../../test/init-database-for-test';
import { app, Role, ROOT_NAME, ROOT_EMAIL, ROOT_PHONE, Branch, BranchError, User, UserError, RoleInBranchError, SID_START_AT } from '../../../src/refs';

describe('POST /user/set-role-in-branch/:branchId', () => {
    let userId: string, branchId: string, token: string, branchName: string, normalBranchId: string, normalBranchName: string;
    beforeEach('Prepare data for test', async () => {
        const dataInit = await InitDatabaseForTest.createNormalBranch();
        userId = dataInit.rootUser._id.toString();
        token = dataInit.rootUser.token.toString();
        branchId = dataInit.branchMaster._id.toString();
        branchName = dataInit.branchMaster.name;
        normalBranchId = dataInit.normalBranch._id.toString();
        normalBranchName = dataInit.normalBranch.name.toString();
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
            birthday: result.birthday,
            city: 'HCM',
            district: 'Phu Nhuan',
            address: '99 Nguyễn Văn Trỗi',
            homeTown: 'HA NOI',
            __v: 0,
            modifieds: [],
            createAt: result.createAt,
            roleInBranchs: [{
                _id: result.roleInBranchs[0]._id,
                branch: { _id: branchId, sid: SID_START_AT, name: branchName },
                __v: 0,
                roles: [Role.CHAIRMAN, Role.ACCOUNTANT, Role.CUSTOMER_CARE_MANAGER]
            }],
            isActive: true,
            passwordVersion: 1
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
            birthday: result.birthday,
            city: 'HCM',
            district: 'Phu Nhuan',
            address: '99 Nguyễn Văn Trỗi',
            homeTown: 'HA NOI',
            __v: 0,
            modifieds: [],
            createAt: result.createAt,
            roleInBranchs: [{
                _id: result.roleInBranchs[0]._id,
                branch: { _id: branchId, sid: SID_START_AT, name: branchName },
                __v: 0,
                roles: [Role.CHAIRMAN]
            },
            {
                _id: result.roleInBranchs[1]._id,
                branch:
                {
                    _id: normalBranchId,
                    sid: SID_START_AT + 1,
                    name: normalBranchName
                },
                __v: 0,
                roles: [Role.ACCOUNTANT, Role.CUSTOMER_CARE_MANAGER]
            }],
            isActive: true,
            passwordVersion: 1
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
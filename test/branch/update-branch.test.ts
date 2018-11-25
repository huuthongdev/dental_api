import request from 'supertest';
import { deepEqual, equal } from 'assert';
import { InititalDatabaseForTest } from '../../test/init-database-for-test';
import { app, Branch, BranchError, CreateBranchService, SID_START_AT, CreateUserService, LoginService, UserError } from '../../src/refs';

describe('PUT /branch/:branchId', () => {
    let userId: string, token: string, branchId: string, normalBranchId: string;
    beforeEach('Prepare data for test', async () => {
        const dataInitial = await InititalDatabaseForTest.createNormalBranch();
        userId = dataInitial.rootUser._id.toString();
        token = dataInitial.rootUser.token.toString();
        branchId = dataInitial.branchMaster._id.toString();
        normalBranchId = dataInitial.normalBranch._id.toString();
    });

    it('Can update branch', async () => {
        const dataSend = {
            name: 'Name update',
            email: 'branchupdate@gmail.com',
            phone: '0908508136 update',
            city: 'HCM update',
            district: 'Phu Nhuan update',
            address: 'address update',
        }
        const response = await request(app).put('/branch/' + normalBranchId)
            .set({ token, branch: branchId }).send(dataSend);
        const { success, result } = response.body;
        equal(response.status, 200);
        equal(success, true);
        const resExpected: any = {
            _id: normalBranchId,
            sid: SID_START_AT + 1,
            name: 'Name update',
            email: 'branchupdate@gmail.com',
            phone: '0908508136 update',
            city: 'HCM update',
            district: 'Phu Nhuan update',
            address: 'address update',
            createBy: userId,
            __v: 0,
            modifieds: result.modifieds,
            createAt: result.createAt,
            isMaster: false,
            isActive: true
        }
        deepEqual(result, resExpected);
        // Check database
        const branchDb = await Branch.findById(normalBranchId) as Branch;
        equal(branchDb.name, 'Name update');
        equal(branchDb.email, 'branchupdate@gmail.com');
        equal(branchDb.phone, '0908508136 update');
        equal(branchDb.city, 'HCM update');
        equal(JSON.parse(branchDb.modifieds[0].dataBackup).name, 'Normal Branch');
        equal(JSON.parse(branchDb.modifieds[0].dataBackup).email, 'normalbranch@gmail.com');
        equal(JSON.parse(branchDb.modifieds[0].dataBackup).phone, '0123');
        equal(JSON.parse(branchDb.modifieds[0].dataBackup).city, 'HCM');
        equal(JSON.parse(branchDb.modifieds[0].dataBackup).district, 'Phu Nhuan');
        equal(JSON.parse(branchDb.modifieds[0].dataBackup).address, 'Address');
    });

    it('Cannot update: Error required', async () => {
        const dataSend = {
            // name: 'Name branch',
            email: 'branch@gmail.com',
            phone: '0908508136',
            city: 'HCM',
            district: 'Phu Nhuan',
            address: 'address',
        }
        const res = await request(app)
            .post('/branch/').set({ token, branch: branchId }).send(dataSend);
        equal(res.status, 400);
        equal(res.body.success, false);
        equal(res.body.message, BranchError.NAME_MUST_BE_PROVIDED);
    });

    it('Cannot create new Branch error unique', async () => {
        await CreateBranchService.create(userId, { name: 'Name', email: 'branch22@gmail.com', phone: '0908557899222', city: 'HCM', district: 'Phu Nhuan', address: 'Address' });
        const dataSend1 = {
            name: 'Name',
            email: 'branch2@gmail.com',
            phone: '09085081361',
            city: 'HCM',
            district: 'Phu Nhuan',
            address: 'address',
        }
        const res1 = await request(app)
            .put('/branch/' + branchId).set({ token, branch: branchId }).send(dataSend1);
        equal(res1.status, 400);
        equal(res1.body.success, false);
        equal(res1.body.message, BranchError.NAME_IS_EXISTED);

        const dataSend2 = {
            name: 'Name 2',
            email: 'branch22@gmail.com',
            phone: '09085081361',
            city: 'HCM',
            district: 'Phu Nhuan',
            address: 'address',
        }
        const res2 = await request(app)
            .put('/branch/' + branchId).set({ token, branch: branchId }).send(dataSend2);
        equal(res2.status, 400);
        equal(res2.body.success, false);
        equal(res2.body.message, BranchError.EMAIL_IS_EXISTED);

        const dataSend3 = {
            name: 'Name 2',
            email: 'branch2@gmail.com',
            phone: '0908557899222',
            city: 'HCM',
            district: 'Phu Nhuan',
            address: 'address',
        }
        const res3 = await request(app)
            .put('/branch/' + branchId).set({ token, branch: branchId }).send(dataSend3);
        equal(res3.status, 400);
        equal(res3.body.success, false);
        equal(res3.body.message, BranchError.PHONE_IS_EXISTED);
    });

    it('Cannot update with invalid email', async () => {
        const dataSend1 = {
            name: 'Name',
            email: 'branch2gmail.com',
            phone: '09085081361',
            city: 'HCM',
            district: 'Phu Nhuan',
            address: 'address',
        }
        const res1 = await request(app)
            .put('/branch/' + branchId).set({ token, branch: branchId }).send(dataSend1);
        equal(res1.status, 400);
        equal(res1.body.success, false);
        equal(res1.body.message, BranchError.EMAIL_INCORRECT);
    });

    it('Cannot update removed branch', async () => {
        await Branch.findByIdAndRemove(branchId);
        const dataSend1 = {
            name: 'Name',
            email: 'branch2gmail.com',
            phone: '09085081361',
            city: 'HCM',
            district: 'Phu Nhuan',
            address: 'address',
        }
        const res1 = await request(app)
            .put('/branch/' + branchId).set({ token, branch: branchId }).send(dataSend1);
        equal(res1.status, 400);
        equal(res1.body.success, false);
        equal(res1.body.message, BranchError.CANNOT_FIND_BRANCH);
    });

    it('Cannot update with invalid id', async () => {
        const dataSend1 = {
            name: 'Name',
            email: 'branch2gmail.com',
            phone: '09085081361',
            city: 'HCM',
            district: 'Phu Nhuan',
            address: 'address',
        }
        const res1 = await request(app)
            .put('/branch/' + 'branchId').set({ token, branch: branchId }).send(dataSend1);
        equal(res1.status, 400);
        equal(res1.body.success, false);
        equal(res1.body.message, 'INVALID_ID');
    });

    // it('Cannot update new branch by a user not chairman', async () => {
    //     await CreateUserService.create(userId, 'Normal User', 'normal@gmail.com', '0123', 'password');
    //     const normalUser = await LoginService.login('0123', undefined ,'password');
    //     const dataSend = {
    //         name: 'Name branch update',
    //         email: 'branch@gmail.com',
    //         phone: '0908508136',
    //         city: 'HCM',
    //         district: 'Phu Nhuan',
    //         address: 'address',
    //         isMaster: true
    //     };
    //     const res = await request(app)
    //         .put('/branch/' + branchId).set({ token: normalUser.token, branch: branchId }).send(dataSend);
    //     equal(res.status, 400);
    //     equal(res.body.success, false);
    //     equal(res.body.message, UserError.PERMISSION_DENIED);
    // });
});
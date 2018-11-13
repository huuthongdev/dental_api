import request from 'supertest';
import { deepEqual, equal } from 'assert';
import { InititalDatabaseForTest } from '../../test/init-database-for-test';
import { app, CreateBranchService, BranchError, SID_START_AT, CreateUserService, LoginService, UserError } from '../../src/refs';

describe('POST /branch/', () => {
    let userId: string, token: string, brandId: string;
    beforeEach('Prepare data for test', async () => {
        const dataInitial = await InititalDatabaseForTest.loginRootAccount();
        userId = dataInitial.rootUser._id.toString();
        token = dataInitial.rootUser.token.toString();
        brandId = dataInitial.branchMaster._id.toString();
    });

    it('Can create new Branch', async () => {
        const dataSend = {
            name: 'Name branch',
            email: 'branch@gmail.com',
            phone: '0908508136',
            city: 'HCM',
            district: 'Phu Nhuan',
            address: 'address',
        }
        const response = await request(app)
            .post('/branch/').set({ token, branch: brandId }).send(dataSend);
        const { success, result } = response.body;
        equal(response.status, 200);
        equal(success, true);
        const resExpected: any = {
            __v: 0,
            sid: SID_START_AT + 1,
            name: 'Name branch',
            email: 'branch@gmail.com',
            phone: '0908508136',
            city: 'HCM',
            district: 'Phu Nhuan',
            address: 'address',
            createBy: userId,
            _id: result._id,
            modifieds: [],
            createAt: result.createAt,
            isMaster: false,
            isActive: true

        }
        deepEqual(result, resExpected);
    });

    it('Cannot create new Branch with invalid input', async () => {
        const dataSend = {
            // name: 'Name branch',
            email: 'branch@gmail.com',
            phone: '0908508136',
            city: 'HCM',
            district: 'Phu Nhuan',
            address: 'address',
        }
        const res = await request(app)
            .post('/branch/').set({ token, branch: brandId }).send(dataSend);
        equal(res.status, 400);
        equal(res.body.success, false);
        equal(res.body.message, BranchError.NAME_MUST_BE_PROVIDED);
    });

    it('Cannot create new Branch error unique', async () => {
        await CreateBranchService.create(userId, 'Name', 'branch@gmail.com', '0908557899', 'HCM', 'Phu Nhuan', 'Address');
        const dataSend1 = {
            name: 'Name',
            email: 'branch2@gmail.com',
            phone: '09085081361',
            city: 'HCM',
            district: 'Phu Nhuan',
            address: 'address',
        }
        const res1 = await request(app)
            .post('/branch/').set({ token, branch: brandId }).send(dataSend1);
        equal(res1.status, 400);
        equal(res1.body.success, false);
        equal(res1.body.message, BranchError.NAME_IS_EXISTED);

        const dataSend2 = {
            name: 'Name 2',
            email: 'branch@gmail.com',
            phone: '09085081361',
            city: 'HCM',
            district: 'Phu Nhuan',
            address: 'address',
        }
        const res2 = await request(app)
            .post('/branch/').set({ token, branch: brandId }).send(dataSend2);
        equal(res2.status, 400);
        equal(res2.body.success, false);
        equal(res2.body.message, BranchError.EMAIL_IS_EXISTED);

        const dataSend3 = {
            name: 'Name 2',
            email: 'branch2@gmail.com',
            phone: '0908557899',
            city: 'HCM',
            district: 'Phu Nhuan',
            address: 'address',
        }
        const res3 = await request(app)
            .post('/branch/').set({ token, branch: brandId }).send(dataSend3);
        equal(res3.status, 400);
        equal(res3.body.success, false);
        equal(res3.body.message, BranchError.PHONE_IS_EXISTED);
    });

    it('Cannot create two master Branch', async () => {
        const dataSend = {
            name: 'Name branch',
            email: 'branch@gmail.com',
            phone: '0908508136',
            city: 'HCM',
            district: 'Phu Nhuan',
            address: 'address',
            isMaster: true
        }
        const res = await request(app)
            .post('/branch/').set({ token, branch: brandId }).send(dataSend);
        equal(res.status, 400);
        equal(res.body.success, false);
        equal(res.body.message, BranchError.ONLY_ONE_MASTER_BRANCH);
    });

    // it('Cannot create new branch by a user not chairman', async () => {
    //     await CreateUserService.create(userId, 'Normal User', 'normal@gmail.com', '0123', 'password');
    //     const normalUser = await LoginService.login('0123', undefined ,'password');
    //     const dataSend = {
    //         name: 'Name branch',
    //         email: 'branch@gmail.com',
    //         phone: '0908508136',
    //         city: 'HCM',
    //         district: 'Phu Nhuan',
    //         address: 'address',
    //         isMaster: true
    //     }
    //     const res = await request(app)
    //         .post('/branch/').set({ token: normalUser.token, branch: brandId }).send(dataSend);
    //     equal(res.status, 400);
    //     equal(res.body.success, false);
    //     equal(res.body.message, UserError.PERMISSION_DENIED);
    // });
});
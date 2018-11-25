import request from 'supertest';
import { deepEqual, equal } from 'assert';
import { InititalDatabaseForTest } from '../../test/init-database-for-test';
import { app, ServiceError, CreateService, Service, SID_START_AT, SetRoleInBranchService, Role, RoleInBranch, CreateServiceMeta, RemoveService, CreateUserService, LoginService, UserError } from '../../src/refs';

const { errors } = CreateServiceMeta;

describe('POST /service/service-meta/:serviceId', () => {
    let token: string, userId: string, serviceId: string, normalBrandId: string, normalUserId: string;
    beforeEach('Prepare data for test', async () => {
        const dataInitial = await InititalDatabaseForTest.createService();
        token = dataInitial.rootUser.token.toString();
        userId = dataInitial.rootUser._id.toString();
        serviceId = dataInitial.service._id.toString();
        normalBrandId = dataInitial.normalBranch._id.toString();
        // Set Direct
        await SetRoleInBranchService.set(userId, normalBrandId, [Role.DIRECTOR]);
    });

    it('Can create service meta', async () => {
        const response = await request(app)
            .post('/service/service-meta/' + serviceId).set({ token, branch: normalBrandId }).send({ price: 8000 });
        const { success, result } = response.body;
        equal(success, true);
        equal(response.status, 200);
        const resExpected: any = {
            _id: serviceId,
            sid: result.sid,
            name: 'Service name',
            suggestedRetailerPrice: 100,
            createBy: userId,
            __v: 0,
            modifieds: [],
            createAt: result.createAt,
            isActive: true,
            serviceMetaes:
                [{
                    _id: result.serviceMetaes[0]._id,
                    service: serviceId,
                    price: 8000,
                    branch: normalBrandId,
                    __v: 0
                }],
            accessories: [],
            basicProcedure: ['Quy trinh'],
            unit: 'Unit'
        };
        deepEqual(result, resExpected);
    });

    it('Cannot create service meta without price', async () => {
        const response = await request(app)
            .post('/service/service-meta/' + serviceId).set({ token, branch: normalBrandId }).send({});
        const { success, message } = response.body;
        equal(success, false);
        equal(response.status, 400);
        equal(message, errors.PRICE_MUST_BE_PROVIDED);
    });

    it('Cannot create service meta when had a service meta in current branch', async () => {
        await CreateServiceMeta.create(serviceId, 80000, normalBrandId);
        const response = await request(app)
            .post('/service/service-meta/' + serviceId).set({ token, branch: normalBrandId }).send({ price: 900000 });
        const { success, message } = response.body;
        equal(success, false);
        equal(response.status, 400);
        equal(message, errors.SERVICE_META_IS_EXISTED_IN_CURRENT_BRANCH);
    });

    it('Cannot create service meta with a remove service', async () => {
        await Service.findByIdAndRemove(serviceId);
        const response = await request(app)
            .post('/service/service-meta/' + serviceId).set({ token, branch: normalBrandId }).send({ price: 900000 });
        const { success, message } = response.body;
        equal(success, false);
        equal(response.status, 400);
        equal(message, ServiceError.CANNOT_FIND_SERVICE);
    });

    // it('Cannot create service meta with user is not direct in current branch', async () => {
    //     await CreateUserService.create(userId, 'Normal', 'normal@gmail.com', '09087777777', 'password');
    //     const userNormal = await LoginService.login(undefined, 'normal@gmail.com', 'password');
    //     const response = await request(app)
    //         .post('/service/service-meta/' + serviceId).set({ token: userNormal.token, branch: normalBrandId }).send({ price: 900000 });
    //     const { success, message } = response.body;
    //     equal(success, false);
    //     equal(response.status, 400);
    //     equal(message, UserError.PERMISSION_DENIED);
    // });
});
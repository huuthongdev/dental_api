import request from 'supertest';
import { deepEqual, equal } from 'assert';
import { app, Service, SID_START_AT, CreateServiceMeta, TicketService, TicketError, ClientError } from '../../src/refs';
import { InititalDatabaseForTest } from '../init-database-for-test';

describe('POST /ticket', () => {
    let token: string, userId: string, normalBranchId: string, clientId: string, dentistId: string, services: Service[];
    beforeEach('Prepare data for test', async () => {
        const dataInitial = await InititalDatabaseForTest.testCreateTicket();
        token = dataInitial.staffCustomerCase.token.toString();
        userId = dataInitial.staffCustomerCase._id.toString();
        clientId = dataInitial.client._id.toString();
        dentistId = dataInitial.dentist._id.toString();
        services = dataInitial.services;
        normalBranchId = dataInitial.normalBranch._id.toString();
    });

    it('Can create ticket, service have not service meta', async () => {
        const items = [{
            service: services[0]._id,
            qty: 1
        }, {
            service: services[1]._id,
            qty: 2
        }];
        const totalAmountExpected = services[0].suggestedRetailerPrice * 1 + services[1].suggestedRetailerPrice * 2;
        const dataSend = { clientId, dentistId, items };
        const response = await request(app)
            .post('/ticket').set({ token, branch: normalBranchId }).send(dataSend);
        const { success, result } = response.body;
        equal(success, true);
        equal(response.status, 200);
        const resExpected: any = {
            _id: result._id,
            sid: SID_START_AT,
            client:
            {
                _id: clientId,
                sid: SID_START_AT,
                name: 'Client',
                phone: '0123',
                email: 'client@gmail.com'
            },
            staffCustomerCase: userId,
            dentistResponsible:
            {
                _id: dentistId,
                sid: SID_START_AT + 1,
                name: 'Dentist',
                email: 'dentist@gmail.com',
                phone: '0999999'
            },
            branchRegister: normalBranchId,
            __v: 0,
            modifieds: [],
            createAt: result.createAt,
            calendars: [],
            receiptVoucher: [],
            totalAmount: totalAmountExpected,
            items: [{
                service:
                {
                    _id: services[0]._id.toString(),
                    sid: SID_START_AT,
                    name: 'Service 1'
                },
                qty: 1,
                _id: result.items[0]._id
            },
            {
                service:
                {
                    _id: services[1]._id.toString(),
                    sid: SID_START_AT + 1,
                    name: 'Service 2'
                },
                qty: 2,
                _id: result.items[1]._id
            }],
            status: 'WORKING'
        }
        deepEqual(result, resExpected);
    });

    it('Can create ticket, service have service meta this branch', async () => {
        const numberServiceMeta = 900;
        await CreateServiceMeta.create(services[0]._id, numberServiceMeta, normalBranchId);
        const items = [{
            service: services[0]._id,
            qty: 1
        }, {
            service: services[1]._id,
            qty: 2
        }];
        const totalAmountExpected = numberServiceMeta * 1 + services[1].suggestedRetailerPrice * 2;
        const dataSend = { clientId, dentistId, items };
        const response = await request(app)
            .post('/ticket').set({ token, branch: normalBranchId }).send(dataSend);
        const { success, result } = response.body;
        equal(success, true);
        equal(response.status, 200);
        const resExpected: any = {
            _id: result._id,
            sid: SID_START_AT,
            client:
            {
                _id: clientId,
                sid: SID_START_AT,
                name: 'Client',
                phone: '0123',
                email: 'client@gmail.com'
            },
            staffCustomerCase: userId,
            dentistResponsible:
            {
                _id: dentistId,
                sid: SID_START_AT + 1,
                name: 'Dentist',
                email: 'dentist@gmail.com',
                phone: '0999999'
            },
            branchRegister: normalBranchId,
            __v: 0,
            modifieds: [],
            createAt: result.createAt,
            calendars: [],
            receiptVoucher: [],
            totalAmount: totalAmountExpected,
            items: [{
                service:
                {
                    _id: services[0]._id.toString(),
                    sid: SID_START_AT,
                    name: 'Service 1'
                },
                qty: 1,
                _id: result.items[0]._id
            },
            {
                service:
                {
                    _id: services[1]._id.toString(),
                    sid: SID_START_AT + 1,
                    name: 'Service 2'
                },
                qty: 2,
                _id: result.items[1]._id
            }],
            status: 'WORKING'
        }
        deepEqual(result, resExpected);
    });

    it('Cannot create ticket with errors required', async () => {
        const items = [{
            service: services[0]._id,
            qty: 1
        }, {
            service: services[1]._id,
            qty: 2
        }];
        const dataSend1 = { clientId: userId, dentistId, items };
        const res1 = await request(app)
            .post('/ticket').set({ token, branch: normalBranchId }).send(dataSend1);
        equal(res1.status, 400);
        equal(res1.body.success, false);
        equal(res1.body.message, ClientError.CANNOT_FIND_CLIENT);

        const dataSend2 = { clientId, dentistId: clientId, items };
        const res2 = await request(app)
            .post('/ticket').set({ token, branch: normalBranchId }).send(dataSend2);
        equal(res2.status, 400);
        equal(res2.body.success, false);
        equal(res2.body.message, TicketError.DENTIST_INFO_INVALID);

        const dataSend3 = { clientId, dentistId, items: [] as [] };
        const res3 = await request(app)
            .post('/ticket').set({ token, branch: normalBranchId }).send(dataSend3);
        equal(res3.status, 400);
        equal(res3.body.success, false);
        equal(res3.body.message, TicketError.ITEMS_MUST_BE_PROVIDED);
    });

    it('Cannot create ticket when choose dentist dont have role dentist', async () => {
        const items = [{
            service: services[0]._id,
            qty: 1
        }, {
            service: services[1]._id,
            qty: 2
        }];
        const dataSend1 = { clientId, dentistId: userId, items };
        const res1 = await request(app)
            .post('/ticket').set({ token, branch: normalBranchId }).send(dataSend1);
        equal(res1.status, 400);
        equal(res1.body.success, false);
        equal(res1.body.message, TicketError.DENTIST_INFO_INVALID);
    });
});
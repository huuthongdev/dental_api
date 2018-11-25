import request from 'supertest';
import { deepEqual, equal } from 'assert';
import { app, Service, SID_START_AT, CreateServiceMeta, TicketService, TicketError, ClientError, Ticket, modifiedSelect, ServiceError, ModifieldTicketMessage } from '../../src/refs';
import { InititalDatabaseForTest } from '../init-database-for-test';

describe('PUT /ticket/items/:ticketId', () => {
    let ticketId: string, dentist2Id: string, token: string, userId: string, normalBranchId: string, clientId: string, dentistId: string, services: Service[];
    beforeEach('Prepare data for test', async () => {
        const dataInitial = await InititalDatabaseForTest.testUpdateTicket();
        token = dataInitial.staffCustomerCase.token.toString();
        userId = dataInitial.staffCustomerCase._id.toString();
        clientId = dataInitial.client._id.toString();
        dentistId = dataInitial.dentist._id.toString();
        services = dataInitial.services;
        normalBranchId = dataInitial.normalBranch._id.toString();
        ticketId = dataInitial.ticket._id.toString();
        dentist2Id = dataInitial.dentist2._id.toString();
    });

    it('Can update ticket items', async () => {
        const oldTicket = await Ticket.findById(ticketId).select(modifiedSelect);
        const items = [{
            service: services[0]._id,
            qty: 10
        }, {
            service: services[1]._id,
            qty: 3
        }];
        const totalAmountExpected = services[0].suggestedRetailerPrice * 10 + services[1].suggestedRetailerPrice * 3;
        const dataSend = { items };
        const response = await request(app)
            .put('/ticket/items/' + ticketId).set({ token, branch: normalBranchId }).send(dataSend);
        const { success, result } = response.body;
        equal(success, true);
        equal(response.status, 200);
        const resExpected: any = {
            _id: result._id,
            sid: result.sid,
            client:
            {
                _id: clientId,
                sid: result.client.sid,
                name: 'Client',
                phone: '0123',
                email: 'client@gmail.com'
            },
            staffCustomerCase: userId,
            dentistResponsible:
            {
                _id: dentistId,
                sid: result.dentistResponsible.sid,
                name: 'Dentist',
                email: 'dentist@gmail.com',
                phone: '0999999'
            },
            branchRegister: normalBranchId,
            __v: 0,
            modifieds: [{
                message: ModifieldTicketMessage.UPDATE_ITEMS,
                dataBackup: JSON.stringify(oldTicket).toString(),
                updateBy: userId,
                updateAt: result.modifieds[0].updateAt,
                _id: result.modifieds[0]._id
            }],
            createAt: result.createAt,
            calendars: [],
            receiptVoucher: [],
            totalAmount: totalAmountExpected,
            items: [{
                service:
                {
                    _id: services[0]._id.toString(),
                    sid: services[0].sid,
                    name: 'Service 1'
                },
                qty: 10,
                _id: result.items[0]._id
            },
            {
                service:
                {
                    _id: services[1]._id.toString(),
                    sid: services[1].sid,
                    name: 'Service 2'
                },
                qty: 3,
                _id: result.items[1]._id
            }],
            status: 'WORKING'
        }
        deepEqual(result, resExpected);
    });

    it('Cannot update with out items', async () => {
        const items = [] as [];
        const dataSend = { items };
        const response = await request(app)
            .put('/ticket/items/' + ticketId).set({ token, branch: normalBranchId }).send(dataSend);
        const { success, message } = response.body;
        equal(success, false);
        equal(response.status, 400);
        equal(message, TicketError.ITEMS_MUST_BE_PROVIDED);
    });

    it('Cannot update with a removed service', async () => {
        const items = [{
            service: services[0]._id,
            qty: 10
        }, {
            service: services[1]._id,
            qty: 3
        }];
        await Service.findByIdAndRemove(services[0]._id);
        const dataSend = { items };
        const response = await request(app)
            .put('/ticket/items/' + ticketId).set({ token, branch: normalBranchId }).send(dataSend);
        const { success, message } = response.body;
        equal(success, false);
        equal(response.status, 400);
        equal(message, ServiceError.CANNOT_FIND_SERVICE);
    });
});
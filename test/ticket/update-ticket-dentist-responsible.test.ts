import request from 'supertest';
import { deepEqual, equal } from 'assert';
import { app, Service, SID_START_AT, TicketError, Ticket, modifiedSelect, ModifieldTicketMessage } from '../../src/refs';
import { InititalDatabaseForTest } from '../init-database-for-test';

describe('PUT /ticket/dentist-reponsible/:ticketId', () => {
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

    it('Can update ticket dentist reponsible', async () => {
        const oldTicket = await Ticket.findById(ticketId).select(modifiedSelect);
        const dataSend = { dentistId: dentist2Id };
        const response = await request(app)
            .put('/ticket/dentist-responsible/' + ticketId).set({ token, branch: normalBranchId }).send(dataSend);
        const { success, result } = response.body;
        equal(success, true);
        equal(response.status, 200);
        const resExpected: any = {
            _id: ticketId,
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
                _id: dentist2Id,
                sid: result.dentistResponsible.sid,
                name: 'Dentist2',
                email: 'dentist2@gmail.com',
                phone: '09999992'
            },
            branchRegister: normalBranchId,
            __v: 0,
            modifieds: [{
                message: ModifieldTicketMessage.CHANGE_DENTIST_RESPONSIBLE,
                dataBackup: JSON.stringify(oldTicket),
                updateBy: userId,
                updateAt: result.modifieds[0].updateAt,
                _id: result.modifieds[0]._id
            }],
            createAt: result.createAt,
            calendars: [],
            receiptVoucher: [],
            totalAmount: 500,
            items: [{
                service:
                {
                    _id: services[0]._id.toString(),
                    sid: result.items[0].service.sid,
                    name: 'Service 1'
                },
                qty: 1,
                _id: result.items[0]._id
            },
            {
                service:
                {
                    _id: services[1]._id.toString(),
                    sid: result.items[1].service.sid,
                    name: 'Service 2'
                },
                qty: 2,
                _id: result.items[1]._id
            }],
            status: 'WORKING'
        }
        deepEqual(result, resExpected);
    });

    it('Cannot update with out dentistId', async () => {
        const dataSend = { dentistId: userId };
        const response = await request(app)
            .put('/ticket/dentist-responsible/' + ticketId).set({ token, branch: normalBranchId }).send(dataSend);
        const { success, message } = response.body;
        equal(success, false);
        equal(response.status, 400);
        equal(message, TicketError.DENTIST_INFO_INVALID);
    });
});
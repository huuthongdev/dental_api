import request from 'supertest';
import { deepEqual, equal } from 'assert';
import { app, Service, SID_START_AT, CreateServiceMeta, TicketService, TicketError, ClientError, Ticket, modifiedSelect, ServiceError, ModifieldTicketMessage, ReceiptVoucherError, Client } from '../../src/refs';
import { InititalDatabaseForTest } from '../init-database-for-test';

describe('POST /receipt-voucher/ticket/:ticketId', () => {
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

    it('Can create ticket receipt voucher', async () => {
        const response = await request(app)
            .post('/receipt-voucher/ticket/' + ticketId).set({ token, branch: normalBranchId }).send({
                totalPayment: 500,
                content: 'Thanh toan',
                clientId
            });
        const { success, result } = response.body;
        equal(success, true);
        equal(response.status, 200);
        const resExpected: any = {
            _id: ticketId,
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
            modifieds: [{
                message: ModifieldTicketMessage.PAYMENT,
                dataBackup: result.modifieds[0].dataBackup,
                updateBy: userId,
                updateAt: result.modifieds[0].updateAt,
                _id: result.modifieds[0]._id
            }],
            createAt: result.createAt,
            calendars: [],
            receiptVoucher: [{
                _id: result.receiptVoucher[0]._id,
                sid: SID_START_AT,
                totalPayment: 500
            }],
            totalAmount: 500,
            items: result.items,
            status: 'WORKING'
        };
        deepEqual(result, resExpected);
    });

    it('Cannot create with over payment limit', async () => {
        const response = await request(app)
            .post('/receipt-voucher/ticket/' + ticketId).set({ token, branch: normalBranchId }).send({
                totalPayment: 800,
                content: 'Thanh toan',
                clientId
            });
        const { success, message } = response.body;
        equal(success, false);
        equal(response.status, 400);
        equal(message, ReceiptVoucherError.OVER_PAYMENT_LIMIT);
    });

    it('Cannot create with ticket not existed', async () => {
        await Ticket.findByIdAndRemove(ticketId);
        const res1 = await request(app)
            .post('/receipt-voucher/ticket/' + ticketId).set({ token, branch: normalBranchId }).send({
                totalPayment: 800,
                content: 'Thanh toan',
                clientId
            });
        equal(res1.body.success, false);
        equal(res1.status, 400);
        equal(res1.body.message, TicketError.CANNOT_FIND_TICKET);
    });

    it('Cannot create with client not existed', async () => {
        await Client.findByIdAndRemove(clientId);
        const res1 = await request(app)
            .post('/receipt-voucher/ticket/' + ticketId).set({ token, branch: normalBranchId }).send({
                totalPayment: 800,
                content: 'Thanh toan',
                clientId
            });
        equal(res1.body.success, false);
        equal(res1.status, 400);
        equal(res1.body.message, ClientError.CANNOT_FIND_CLIENT);
    });
});
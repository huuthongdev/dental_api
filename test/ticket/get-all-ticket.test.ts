import request from 'supertest';
import { deepEqual, equal } from 'assert';
import { app, Service, SID_START_AT, CreateServiceMeta, TicketService, TicketError, ClientError, Ticket, modifiedSelect, ServiceError, ModifieldTicketMessage } from '../../src/refs';
import { InititalDatabaseForTest } from '../init-database-for-test';

describe('GET /ticket', () => {
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

    it('Can get all ticket', async () => {
        const response = await request(app)
            .get('/ticket').set({ token, branch: normalBranchId })
        const { success } = response.body;
        equal(success, true);
    });

});
import request from 'supertest';
import { deepEqual, equal } from 'assert';
import { InititalDatabaseForTest } from '../../test/init-database-for-test';
import { app, SID_START_AT, ClientError, CreateClientService, Client, modifiedSelect, Gender, CreateTicketService, CreateUserService, SetRoleInBranchService, Role } from '../../src/refs';
import { hash } from 'bcryptjs';

describe('GET /client-detail/:clientId', () => {
    let token: string, userId: string, branchId: string, normalBranchId: string, clientId: string, dentistId: string;
    beforeEach('Prepare data for test', async () => {
        const dataInitial = await InititalDatabaseForTest.createClient();
        token = dataInitial.rootUser.token.toString();
        userId = dataInitial.rootUser._id.toString();
        branchId = dataInitial.branchMaster._id.toString();
        normalBranchId = dataInitial.normalBranch._id.toString();
        clientId = dataInitial.client._id.toString();
        // Create A dentist
        const dentist = await CreateUserService.create(userId, { name: 'Dentist', email: 'dentis@gmail.com', phone: '0123131203821098', password: await hash('admin', 8) });
        await SetRoleInBranchService.set(dentist._id, branchId, [Role.DENTIST]);
        dentistId = dentist._id;
    });

    it('Can get client detail data', async () => {
        const response = await request(app)
        .get('/client/detail/' + clientId).set({ token, branch: branchId });
        const { success, result } = response.body;
        // Create Ticket for this client
    });
});
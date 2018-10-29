import request from 'supertest';
import { deepEqual, equal } from 'assert';
import { CreateUserService, app } from '../../src/refs';

const { errors } = CreateUserService;

describe('POST /user/', () => {
    it('Can create new user', async () => {
        const response = await request(app)
        .post('/user')
    });
});
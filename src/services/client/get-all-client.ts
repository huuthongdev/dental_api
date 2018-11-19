import { Client } from "../../../src/refs";

export class GetAllClientsService {
    static async get() {
        return await Client.find({});
    }
}
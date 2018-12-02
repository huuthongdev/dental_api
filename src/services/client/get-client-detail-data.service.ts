import { Client, mustExist, ClientError, mustBeObjectId, Ticket } from "../../../src/refs";

export class GetClientDetailDataService {
    static async getDetailRelated(clientId: string) {
        // Ticket
        const tickets = await Ticket.find({ client: clientId });
        return { tickets }
    }

    static async get(clientId: string) {
        mustBeObjectId(clientId);
        const clientInfo = await Client.findById(clientId);
        mustExist(clientInfo, ClientError.CANNOT_FIND_CLIENT);
        const detail = await this.getDetailRelated(clientId);
        let client = clientInfo.toObject();
        client.detail = detail;
        return client;
    }
}
import { Client, ClientError, modifiedSelect, mustExist, ModifiedService, mustBeObjectId } from "../../../src/refs";

export class RemoveClientService {
    static async validate(clientId: string) {
        mustBeObjectId(clientId);
        const oldClient = await Client.findById(clientId).select(modifiedSelect) as Client;
        mustExist(oldClient, ClientError.CANNOT_FIND_CLIENT);
        return oldClient;
    }

    static async remove(clientId: string) {
        await this.validate(clientId);
        return await Client.findByIdAndRemove(clientId);
    }

    static async disable(userId: string, clientId: string) {
        const oldClient = await this.validate(clientId);
        await Client.findByIdAndUpdate(clientId, { isActive: false }, { new: true });
        return await ModifiedService.client(clientId, userId, oldClient);
    }

    static async enable(userId: string, clientId: string) {
        const oldClient = await this.validate(clientId);
        await Client.findByIdAndUpdate(clientId, { isActive: true }, { new: true });
        return await ModifiedService.client(clientId, userId, oldClient);
    }
}
import { Client, mustExist, ClientError, mustBeObjectId, Ticket } from "../../../src/refs";

export class GetClientDetailDataService {
    static async getDetailRelated(clientId: string) {
        // Ticket
        const tickets = await Ticket.find({ client: clientId })
            .sort({ createAt: -1 })
            .select('sid client dentistResponsible status items totalAmount receiptVoucher createAt')
            .populate('client', 'name email phone')
            .populate('dentistResponsible', 'name email phone')
            .populate('items.service', 'name unit')
            .populate('receiptVoucher')
            .populate('branchRegister', 'name');
        return { tickets }
    }

    static async get(clientId: string) {
        mustBeObjectId(clientId);
        const clientInfo = await Client.findById(clientId);
        mustExist(clientInfo, ClientError.CANNOT_FIND_CLIENT);
        const detail = await this.getDetailRelated(clientId);
        let client = clientInfo.toObject();
        return {
            ...client,
            ...detail
        };
    }
}
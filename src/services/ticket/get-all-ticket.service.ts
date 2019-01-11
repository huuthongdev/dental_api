import { Ticket } from "../../../src/refs";

export class GetAllTicketService {
    static async getAll() {
        return Ticket.find({}).sort({ createAt: -1 })
            .select('sid client dentistResponsible status items totalAmount')
            .populate('client', 'name email phone')
            .populate('dentistResponsible', 'name email phone')
            .populate('items.service', 'name unit')
    }
}
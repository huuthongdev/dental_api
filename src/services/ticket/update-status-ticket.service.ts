import { mustBeObjectId, Ticket, TicketError, mustExist, TicketStatus, ModifiedService, ModifieldTicketMessage } from "../../../src/refs";

export class UpdateStatusTicketService {
    static async validate(staffId: string, ticketId: string, status: TicketStatus) {
        mustBeObjectId(staffId, ticketId);
        const ticket = await Ticket.findById(ticketId) as Ticket;
        mustExist(ticket, TicketError.CANNOT_FIND_TICKET);
        const ticketStatusArr = [TicketStatus.DONE, TicketStatus.WORKING, TicketStatus.PENDING] as TicketStatus[];
        mustExist(ticketStatusArr.find(v => v === status), TicketError.INVALID_TICKET_STATUS);
        return ticket;
    }

    static async update(staffId: string, ticketId: string, status: TicketStatus) {
        mustBeObjectId(staffId, ticketId);
        const oldTicket = await this.validate(staffId, ticketId, status);
        const newTicket = await Ticket.findByIdAndUpdate(ticketId, { status }, { new: true });
        ModifiedService.ticket(ticketId, staffId, oldTicket, ModifieldTicketMessage.UPDATE_TICKET_STATUS);
        return newTicket;
    }
}
import { Ticket, mustBeObjectId, mustExist, TicketError, CalendarDentist } from "../../../src/refs";

export class GetTicketDetailService {
    static async get(_id: string) {
        mustBeObjectId(_id);
        const ticketInfo = await Ticket.findById(_id) 
            .populate('client', 'sid name email phone gender city district address medicalHistory')
            .populate('staffCustomerCase', 'sid name email phone')
            .populate('dentistResponsible', 'sid name email phone')
            .populate('branchRegister', 'sid name email phone')
            .populate('items.service', 'name sid unit')
            .populate('receiptVoucher', 'sid totalPayment')
        mustExist(ticketInfo, TicketError.CANNOT_FIND_TICKET);
        let ticket = ticketInfo.toObject();
        const dataRelated = await this.getDataRelated(_id);
        return {
            ...ticket,
            ...dataRelated
        }
    }

    static async getDataRelated(_id: string) {
        const calendar = await CalendarDentist.find({ ticket: _id })
        .populate('dentist', 'sid name email phone')
        .populate('createBy', 'sid name email phone');
        return { calendar };
    }
}
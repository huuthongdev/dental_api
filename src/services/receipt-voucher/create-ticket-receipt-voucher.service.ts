import { mustBeObjectId, Ticket, mustExist, TicketError, Client, ClientError, modifiedSelect, ReceiptVoucher, makeSure, ReceiptVoucherError, SID_START_AT, ReceiptVoucherType, ModifiedService, ModifieldTicketMessage } from "../../../src/refs";

export class CreateTicketReceiptVoucherService {
    static async validate(userId: string, branchId: string, clientId: string, totalPayment: number, ticketId: string, content: string) {
        mustBeObjectId(userId, branchId, clientId, ticketId);
        // Must Exist
        const ticket = await Ticket.findById(ticketId).select(modifiedSelect) as Ticket;
        mustExist(ticket, TicketError.CANNOT_FIND_TICKET);
        const client = await Client.findById(clientId);
        mustExist(client, ClientError.CANNOT_FIND_CLIENT);
        // Make Sure
        makeSure(totalPayment > 0, ReceiptVoucherError.TOTAL_PAYMENT_IS_ZERO);
        // Check Ticket 
        makeSure(totalPayment <= ticket.totalAmount, ReceiptVoucherError.OVER_PAYMENT_LIMIT);
        const checkReceiptVoucherThisTicket = await ReceiptVoucher.find({ ticket: ticketId }).select('totalPayment') as ReceiptVoucher[];
        if (!checkReceiptVoucherThisTicket || checkReceiptVoucherThisTicket.length === 0) return ticket;
        let totalPaymented: number = 0;
        for (let i = 0; i < checkReceiptVoucherThisTicket.length; i++) {
            totalPaymented += +checkReceiptVoucherThisTicket[i].totalPayment;
        }
        makeSure(totalPaymented < ticket.totalAmount, ReceiptVoucherError.OVER_PAYMENT_LIMIT);
        return ticket;
    }

    static async create(userId: string, branchId: string, clientId: string, totalPayment: number, ticketId: string, content: string) {
        const oldTicket = await this.validate(userId, branchId, clientId, totalPayment, ticketId, content);
        const sid = await this.getSid();
        const receiptVoucher = new ReceiptVoucher({
            sid, type: ReceiptVoucherType.FOR_TICKET,
            client: clientId,
            branchTransaction: branchId,
            cashier: userId,
            totalPayment,
            content
        });
        await receiptVoucher.save();
        await Ticket.findByIdAndUpdate(ticketId, { $addToSet: { receiptVoucher: receiptVoucher._id } }, { new: true });
        return await ModifiedService.ticket(ticketId, userId, oldTicket, ModifieldTicketMessage.PAYMENT);
    }

    static async getSid() {
        const maxSid = await ReceiptVoucher.find({}).sort({ sid: -1 }).limit(1) as ReceiptVoucher[];
        if (maxSid.length === 0) return SID_START_AT;
        return maxSid[0].sid + 1;
    }
}